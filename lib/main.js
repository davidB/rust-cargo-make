"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const io = __importStar(require("@actions/io"));
const tc = __importStar(require("@actions/tool-cache"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const tmpFolder = os.tmpdir();
        try {
            const cargoMakeVersion = core.getInput('version');
            console.log(`installing cargo-make ${cargoMakeVersion} ...`);
            const execFolder = path.join(os.homedir(), '.cargo', 'bin');
            core.debug(execFolder);
            yield io.mkdirP(execFolder);
            core.debug(process.platform);
            let exe_ext = '';
            let arch = 'noarch';
            if (process.platform === 'win32') {
                arch = 'x86_64-pc-windows-msvc';
                exe_ext = '.exe';
            }
            else if (process.platform === 'darwin') {
                arch = 'x86_64-apple-darwin';
            }
            else if (process.platform === 'linux') {
                arch = 'x86_64-unknown-linux-musl';
            }
            else {
                core.setFailed('unsupported platform:' + process.platform);
                return;
            }
            const archive = `cargo-make-v${cargoMakeVersion}-${arch}`;
            const cargoMakeArchive = yield tc.downloadTool(`https://github.com/sagiegurari/cargo-make/releases/download/${cargoMakeVersion}/${archive}.zip`);
            const extractedFolder = yield tc.extractZip(cargoMakeArchive, tmpFolder);
            const exec = `cargo-make${exe_ext}`;
            const execPath = path.join(execFolder, exec);
            yield io.mv(path.join(extractedFolder, archive, exec), execPath);
            yield io.rmRF(path.join(extractedFolder, archive));
            core.debug(`installed: ${execPath} : ${fs.existsSync(execPath)}`);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
