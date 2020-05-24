import * as cp from 'child_process'
import * as os from 'os'
import * as path from 'path'
import * as process from 'process'

function exec_check() {
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

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs with fixed version="0.30.7"', () => {
  process.env['RUNNER_TEMP'] = os.tmpdir()
  process.env['INPUT_VERSION'] = '0.30.7'
  exec_check()
})

test('test runs with version="latest"', () => {
  process.env['RUNNER_TEMP'] = os.tmpdir()
  process.env['INPUT_VERSION'] = 'latest'
  exec_check()
})

test('test runs without version defined', () => {
  process.env['RUNNER_TEMP'] = os.tmpdir()
  exec_check()
})
