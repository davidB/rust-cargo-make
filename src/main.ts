import * as core from '@actions/core';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import * as os from 'os';
import { CodeGenerator } from '@babel/generator';

async function run() {
  const tmpFolder = os.tmpdir()
  try {
    const cargoMakeVersion = core.getInput('version')
    console.log(`installing cargo-make ${cargoMakeVersion} ...`)

    const execFolder = os.homedir + '/.cargo/bin'
    core.debug(execFolder)
    await io.mkdirP(execFolder)
    core.debug(process.platform)
    if (process.platform === 'win32') {
      const archive = `cargo-make-v${cargoMakeVersion}-x86_64-pc-windows-msvc`
      const cargoMakeArchive = await tc.downloadTool(`https://github.com/sagiegurari/cargo-make/releases/download/${cargoMakeVersion}/${archive}.zip`)
      const extractedFolder = await tc.extractZip(cargoMakeArchive, tmpFolder)
      io.mv(`${extractedFolder}/${archive}/cargo-make.exe`, execFolder)
      io.rmRF(`${extractedFolder}/${archive}`)
      core.setOutput('installed', execFolder)
      // const node12Path = tc.downloadTool('https://nodejs.org/dist/v12.7.0/node-v12.7.0-win-x64.7z')
      // const node12ExtractedFolder = await tc.extract7z(node12Path, 'path/to/extract/to')
    } else if (process.platform === 'darwin') {
      const archive = `cargo-make-v${cargoMakeVersion}-x86_64-apple-darwin`
    } else if (process.platform === 'linux') {
      const archive = `cargo-make-v${cargoMakeVersion}-x86_64-unknown-linux-musl`
      const cargoMakeArchive = await tc.downloadTool(`https://github.com/sagiegurari/cargo-make/releases/download/${cargoMakeVersion}/${archive}.zip`)
      const extractedFolder = await tc.extractZip(cargoMakeArchive, tmpFolder)
      io.mv(`${extractedFolder}/${archive}/cargo-make`, execFolder)
      io.rmRF(`${extractedFolder}/${archive}`)
      core.setOutput('installed', execFolder)
    } else {
      core.setFailed('unsupported platform:' + process.platform)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run();
