import * as core from '@actions/core';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import * as os from 'os';

async function run() {
  try {
    const cargoMakeVersion = core.getInput('version')
    console.log(`installing cargo-make ${cargoMakeVersion} ...`)

    const execFolder = os.homedir + '/.cargo/bin2'
    core.debug(execFolder)
    await io.mkdirP(execFolder)
    if (process.platform === 'win32') {
      const cargoMakeArchive = await tc.downloadTool(`https://github.com/sagiegurari/cargo-make/releases/download/${cargoMakeVersion}/cargo-make-v${cargoMakeVersion}-x86_64-pc-windows-msvc.zip`)
      const extractedFolder = await tc.extractZip(cargoMakeArchive, execFolder)
      core.setOutput('installed at ', extractedFolder);
      // const node12Path = tc.downloadTool('https://nodejs.org/dist/v12.7.0/node-v12.7.0-win-x64.7z')
      // const node12ExtractedFolder = await tc.extract7z(node12Path, 'path/to/extract/to')
    } else if (process.platform === 'darwin') {
      const cargoMakeArchive = await tc.downloadTool(`https://github.com/sagiegurari/cargo-make/releases/download/${cargoMakeVersion}/cargo-make-v${cargoMakeVersion}-x86_64-apple-darwin.zip`)
      const extractedFolder = await tc.extractZip(cargoMakeArchive, execFolder)
      core.setOutput('installed at ', extractedFolder)
    } else if (process.platform === 'linux') {
      const cargoMakeArchive = await tc.downloadTool(`https://github.com/sagiegurari/cargo-make/releases/download/${cargoMakeVersion}/cargo-make-v${cargoMakeVersion}-x86_64-unknown-linux-musl.zip`)
      const extractedFolder = await tc.extractZip(cargoMakeArchive, execFolder)
      core.setOutput('installed at ', extractedFolder)
    } else {
      core.setFailed('unsupported platform:' + process.platform)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run();
