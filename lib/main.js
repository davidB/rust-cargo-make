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
        try {
            const cargoMakeVersion = core.getInput('version');
            console.log(`installing cargo-make ${cargoMakeVersion} ...`);
            const execFolder = os.homedir + '/.cargo/bin2';
            core.debug(execFolder);
            yield io.mkdirP(execFolder);
            core.debug("mkdirP done");
            if (process.platform === 'win32') {
                const cargoMakeArchive = yield tc.downloadTool(`https://github.com/sagiegurari/cargo-make/releases/download/${cargoMakeVersion}/cargo-make-v${cargoMakeVersion}-x86_64-pc-windows-msvc.zip`);
                const extractedFolder = yield tc.extractZip(cargoMakeArchive, execFolder);
                core.setOutput('installed at ', extractedFolder);
                // const node12Path = tc.downloadTool('https://nodejs.org/dist/v12.7.0/node-v12.7.0-win-x64.7z')
                // const node12ExtractedFolder = await tc.extract7z(node12Path, 'path/to/extract/to')
            }
            else if (process.platform === 'darwin') {
                const cargoMakeArchive = yield tc.downloadTool(`https://github.com/sagiegurari/cargo-make/releases/download/${cargoMakeVersion}/cargo-make-v${cargoMakeVersion}-x86_64-apple-darwin.zip`);
                const extractedFolder = yield tc.extractZip(cargoMakeArchive, execFolder);
                core.setOutput('installed at ', extractedFolder);
            }
            else if (process.platform === 'linux') {
                const cargoMakeArchive = yield tc.downloadTool(`https://github.com/sagiegurari/cargo-make/releases/download/${cargoMakeVersion}/cargo-make-v${cargoMakeVersion}-x86_64-unknown-linux-musl.zip`);
                const extractedFolder = yield tc.extractZip(cargoMakeArchive, execFolder);
                core.setOutput('installed at ', extractedFolder);
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
