import * as core from '@actions/core';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

async function run() {
  const tmpFolder = os.tmpdir()
  try {
    const cargoMakeVersion = core.getInput('version')
    console.log(`installing cargo-make ${cargoMakeVersion} ...`)
    const platform =  core.getInput('platform') || process.platform
    core.debug(platform)

    const execFolder = path.join(os.homedir(), '.cargo', 'bin')
    core.debug(execFolder)
    await io.mkdirP(execFolder)

    let exe_ext = ''
    let arch = 'noarch'
    let archTopFolder = ''
    if (platform === 'win32') {
      arch = 'x86_64-pc-windows-msvc'
      archTopFolder = ''
      exe_ext = '.exe'
    } else if (platform === 'darwin') {
      arch = 'x86_64-apple-darwin'
      archTopFolder = arch
    } else if (platform === 'linux') {
      arch = 'x86_64-unknown-linux-musl'
      archTopFolder = arch
    } else {
      core.setFailed('unsupported platform:' + process.platform)
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
    core.debug(`installed: ${execPath} : ${fs.existsSync(execPath)}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run();
