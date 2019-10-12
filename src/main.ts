import * as core from '@actions/core';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import * as os from 'os';
import * as path from 'path';

async function run() {
  const tmpFolder = os.tmpdir()
  try {
    const cargoMakeVersion = core.getInput('version')
    console.log(`installing cargo-make ${cargoMakeVersion} ...`)

    const execFolder = path.join(os.homedir(), '.cargo', 'bin')
    core.debug(execFolder)
    await io.mkdirP(execFolder)
    core.debug(process.platform)

    let exe_ext = ''
    let arch= 'noarch'
    if (process.platform === 'win32') {
      arch = 'x86_64-pc-windows-msvc'
      exe_ext = '.exe'
    } else if (process.platform === 'darwin') {
      arch = 'x86_64-apple-darwin'
    } else if (process.platform === 'linux') {
      arch = 'x86_64-unknown-linux-musl'
    } else {
      core.setFailed('unsupported platform:' + process.platform)
      return
    }
    const archive = `cargo-make-v${cargoMakeVersion}-${arch}`
    const cargoMakeArchive = await tc.downloadTool(`https://github.com/sagiegurari/cargo-make/releases/download/${cargoMakeVersion}/${archive}.zip`)
    const extractedFolder = await tc.extractZip(cargoMakeArchive, tmpFolder)
    io.mv(path.join(extractedFolder, archive, `cargo-make${exe_ext}`), execFolder)
    io.rmRF(path.join(extractedFolder, archive))
    core.setOutput('installed', execFolder)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run();
