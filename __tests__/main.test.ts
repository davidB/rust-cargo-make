import { expect } from '@jest/globals'
import * as cp from 'child_process'
import * as os from 'os'
import * as path from 'path'
import * as process from 'process'

function exec_check(): void {
  const options: cp.ExecSyncOptionsWithStringEncoding = {
    env: process.env,
    encoding: 'utf-8'
  }
  const jscmd = path.join(__dirname, '..', 'dist', 'index.js')
  const exec = cp.spawnSync('node', [jscmd], options)
  if (exec.status != 0) {
    console.log(exec)
  }
  expect(exec.status).toEqual(0)
  expect(exec.stdout).toEqual(expect.stringMatching(/::debug::installed:/))
  expect(exec.stdout).toEqual(expect.stringMatching(/done/))
}

describe('action', () => {
  // shows how the runner will run a javascript action with env / stdout protocol
  it('runs with fixed version="0.22.1"', () => {
    process.env['RUNNER_TEMP'] = os.tmpdir()
    process.env['INPUT_VERSION'] = '0.22.1'
    process.env['INPUT_FALLBACK_VERSION'] = '"0.37.23'
    exec_check()
  })

  it('runs with version="latest"', () => {
    process.env['RUNNER_TEMP'] = os.tmpdir()
    process.env['INPUT_VERSION'] = 'latest'
    process.env['INPUT_FALLBACK_VERSION'] = '"0.37.23'
    exec_check()
  })

  it('runs without version defined', () => {
    process.env['RUNNER_TEMP'] = os.tmpdir()
    process.env['INPUT_FALLBACK_VERSION'] = '"0.37.23'
    exec_check()
  })
})
