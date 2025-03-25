import * as core from '@actions/core'
import * as github from '@actions/github'
import * as io from '@actions/io'
import * as tc from '@actions/tool-cache'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

async function findVersionLatest(fallbackVersion: string): Promise<string> {
  core.info(`search latest version of cargo-make`)
  let version: string = fallbackVersion
  // octokit require a token also for public (anonymous endpoint)
  const token = core.getInput('github_token') || process.env['GITHUB_TOKEN']
  if (token) {
    const octokit = github.getOctokit(token)
    const { data } = await octokit.rest.repos.getLatestRelease({
      owner: 'sagiegurari',
      repo: 'cargo-make'
    })
    version = data.tag_name
    core.debug(`latest cargo-make release found: ${version}`)
  } else {
    core.warning(
      `no GITHUB_TOKEN in env to retrieve the latest version, fallback to ${fallbackVersion}`
    )
  }
  return Promise.resolve(version || fallbackVersion)
}

async function findVersion(): Promise<string> {
  const inputVersion = core.getInput('version')
  if (
    inputVersion === 'latest' ||
    inputVersion == null ||
    inputVersion === undefined
  ) {
    return findVersionLatest(core.getInput('fallback_version'))
  }
  return Promise.resolve(inputVersion)
}

export async function run(): Promise<void> {
  const tmpFolder = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), 'setup-rust-cargo-make-'),
    {
      encoding: 'utf8'
    }
  )
  try {
    const cargoMakeVersion = await findVersion()
    core.info(`installing cargo-make ${cargoMakeVersion} ...`)
    const platform = process.env['PLATFORM'] || process.platform
    core.debug(platform)

    const execFolder = path.join(os.homedir(), '.cargo', 'bin')
    core.debug(execFolder)
    await io.mkdirP(execFolder)

    let exeExt = ''
    let arch = 'noarch'
    let archTopFolder = ''
    switch (platform) {
      case 'win32':
        arch = 'x86_64-pc-windows-msvc'
        archTopFolder = ''
        exeExt = '.exe'
        break
      case 'darwin':
        arch = 'x86_64-apple-darwin'
        archTopFolder = `cargo-make-v${cargoMakeVersion}-${arch}`
        break
      case 'linux':
        arch = 'x86_64-unknown-linux-musl'
        archTopFolder = `cargo-make-v${cargoMakeVersion}-${arch}`
        break
      default:
        core.setFailed(`unsupported platform: ${platform}`)
        return
    }
    const archive = `cargo-make-v${cargoMakeVersion}-${arch}`
    // see https://docs.github.com/en/actions/reference/environment-variables#default-environment-variables
    const githubServerUrl =
      process.env['GITHUB_SERVER_URL'] || 'https://github.com'
    const url = `${githubServerUrl}/sagiegurari/cargo-make/releases/download/${cargoMakeVersion}/${archive}.zip`
    core.info(`downloading (${cargoMakeVersion}) from ${url}`)
    const cargoMakeArchive = await tc.downloadTool(url)
    const extractedFolder = await tc.extractZip(cargoMakeArchive, tmpFolder)
    for (const exeName of ['cargo-make', 'makers']) {
      const exec = `${exeName}${exeExt}`
      const srcExecPath = path.join(extractedFolder, archTopFolder, exec)
      if (fs.existsSync(srcExecPath)) {
        const execPath = path.join(execFolder, exec)
        await io.cp(srcExecPath, execPath)
        core.debug(`installed: ${execPath}`)
      } else {
        core.warning(`NOT installed: ${exec} (not found in the ${url})`)
      }
    }
    await io.rmRF(path.join(extractedFolder, archive))
    core.info('done')
  } catch (error) {
    if (error instanceof Error) {
      core.error(error)
      core.setFailed(error)
    } else {
      core.setFailed(String(error))
    }
  } finally {
    await io.rmRF(tmpFolder)
  }
}
