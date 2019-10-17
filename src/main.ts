import * as core from '@actions/core';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import * as os from 'os';
import * as path from 'path';
// use typed-rest-client like actions/tool-cache
import * as httpm from 'typed-rest-client/HttpClient';

let httpc: httpm.HttpClient = new httpm.HttpClient('vsts-node-api');

async function findVersionLatest(): Promise<string> {
  const response = await httpc.get('https://api.github.com/repos/sagiegurari/cargo-make/releases/latest')
  const body = await response.readBody()
  return Promise.resolve(JSON.parse(body).tag_name)
}

async function findVersion(): Promise<string> {
  const inputVersion = core.getInput('version')
  let cargoMakeVersion = inputVersion
  if (inputVersion === 'latest') {
    return findVersionLatest()
  }
  return Promise.resolve(inputVersion)
}

async function run() {
  const tmpFolder = path.join(os.tmpdir(), "setup-rust-cargo-make")
  const _ = await io.mkdirP(tmpFolder)
  try {
    const cargoMakeVersion = await findVersion()
    console.log(`installing cargo-make ${cargoMakeVersion} ...`)
    const platform = process.env['PLATFORM'] || process.platform
    core.debug(platform)

    const execFolder = path.join(os.homedir(), '.cargo', 'bin')
    core.debug(execFolder)
    await io.mkdirP(execFolder)

    let exe_ext = ''
    let arch = 'noarch'
    let archTopFolder = ''
    switch(platform) {
      case 'win32':
        arch = 'x86_64-pc-windows-msvc'
        archTopFolder = ''
        exe_ext = '.exe'
        break;
      case 'darwin':
        arch = 'x86_64-apple-darwin'
        archTopFolder = `cargo-make-v${cargoMakeVersion}-${arch}`
        break;
      case 'linux':
        arch = 'x86_64-unknown-linux-musl'
        archTopFolder = `cargo-make-v${cargoMakeVersion}-${arch}`
        break;
      default:
        core.setFailed('unsupported platform:' + platform)
        return
    }
    const archive = `cargo-make-v${cargoMakeVersion}-${arch}`
    const cargoMakeArchive = await tc.downloadTool(`https://github.com/sagiegurari/cargo-make/releases/download/${cargoMakeVersion}/${archive}.zip`)
    const extractedFolder = await tc.extractZip(cargoMakeArchive, tmpFolder)
    const exec = `cargo-make${exe_ext}`
    const execPath = path.join(execFolder, exec)
    await io.mv(path.join(extractedFolder, archTopFolder, exec), execPath).then(() =>
      io.rmRF(path.join(extractedFolder, archive))
    )
    core.debug(`installed: ${execPath}`)
  } catch (error) {
    console.error(error)
    core.setFailed(error.message)
  } finally {
    io.rmRF(tmpFolder)
  }
}

run().then(
  () => console.log("done"),
  (err) => console.error(err)
);
