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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const tmpFolder = os.tmpdir();
        try {
            const cargoMakeVersion = core.getInput('version');
            console.log(`installing cargo-make ${cargoMakeVersion} ...`);
            const execFolder = os.homedir + '/.cargo/bin';
            core.debug(execFolder);
            yield io.mkdirP(execFolder);
            core.debug(process.platform);
            if (process.platform === 'win32') {
                const archive = `cargo-make-v${cargoMakeVersion}-x86_64-pc-windows-msvc`;
                const cargoMakeArchive = yield tc.downloadTool(`https://github.com/sagiegurari/cargo-make/releases/download/${cargoMakeVersion}/${archive}.zip`);
                const extractedFolder = yield tc.extractZip(cargoMakeArchive, tmpFolder);
                io.mv(`${extractedFolder}/${archive}/cargo-make.exe`, execFolder);
                io.rmRF(`${extractedFolder}/${archive}`);
                core.setOutput('installed', execFolder);
                // const node12Path = tc.downloadTool('https://nodejs.org/dist/v12.7.0/node-v12.7.0-win-x64.7z')
                // const node12ExtractedFolder = await tc.extract7z(node12Path, 'path/to/extract/to')
            }
            else if (process.platform === 'darwin') {
                const archive = `cargo-make-v${cargoMakeVersion}-x86_64-apple-darwin`;
            }
            else if (process.platform === 'linux') {
                const archive = `cargo-make-v${cargoMakeVersion}-x86_64-unknown-linux-musl`;
                const cargoMakeArchive = yield tc.downloadTool(`https://github.com/sagiegurari/cargo-make/releases/download/${cargoMakeVersion}/${archive}.zip`);
                const extractedFolder = yield tc.extractZip(cargoMakeArchive, tmpFolder);
                io.mv(`${extractedFolder}/${archive}/cargo-make`, execFolder);
                io.rmRF(`${extractedFolder}/${archive}`);
                core.setOutput('installed', execFolder);
            }
            else {
                core.setFailed('unsupported platform:' + process.platform);
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
