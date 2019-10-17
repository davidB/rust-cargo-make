import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as os from 'os'

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs with fixed version="0.22.2"', () => {
    process.env['RUNNER_TEMP'] = os.tmpdir()
    process.env['INPUT_VERSION'] = "0.22.2"
    const ip = path.join(__dirname, '..', 'lib', 'main.js');
    const options: cp.ExecSyncOptions = {
        env: process.env
    };
    console.log(cp.execSync(`node ${ip}`, options).toString());
});

test('test runs with version="latest"', () => {
  process.env['RUNNER_TEMP'] = os.tmpdir()
  process.env['INPUT_VERSION'] = "latest"
  const ip = path.join(__dirname, '..', 'lib', 'main.js');
  const options: cp.ExecSyncOptions = {
      env: process.env
  };
  console.log(cp.execSync(`node ${ip}`, options).toString());
});
