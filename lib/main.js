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
// use typed-rest-client like actions/tool-cache
const httpm = __importStar(require("typed-rest-client/HttpClient"));
let httpc = new httpm.HttpClient('vsts-node-api');
function findVersionLatest() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`search latest version of cargo-make`);
        const response = yield httpc.get('https://api.github.com/repos/sagiegurari/cargo-make/releases/latest');
        const body = yield response.readBody();
        return Promise.resolve(JSON.parse(body).tag_name || '0.23.0');
    });
}
function findVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputVersion = core.getInput('version');
        if (inputVersion === 'latest' || inputVersion == null || inputVersion == undefined) {
            return findVersionLatest();
        }
        return Promise.resolve(inputVersion);
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const tmpFolder = path.join(os.tmpdir(), "setup-rust-cargo-make");
        const _ = yield io.mkdirP(tmpFolder);
        try {
            const cargoMakeVersion = yield findVersion();
            console.log(`installing cargo-make ${cargoMakeVersion} ...`);
            const platform = process.env['PLATFORM'] || process.platform;
            core.debug(platform);
            const execFolder = path.join(os.homedir(), '.cargo', 'bin');
            core.debug(execFolder);
            yield io.mkdirP(execFolder);
            let exe_ext = '';
            let arch = 'noarch';
            let archTopFolder = '';
            switch (platform) {
                case 'win32':
                    arch = 'x86_64-pc-windows-msvc';
                    archTopFolder = '';
                    exe_ext = '.exe';
                    break;
                case 'darwin':
                    arch = 'x86_64-apple-darwin';
                    archTopFolder = `cargo-make-v${cargoMakeVersion}-${arch}`;
                    break;
                case 'linux':
                    arch = 'x86_64-unknown-linux-musl';
                    archTopFolder = `cargo-make-v${cargoMakeVersion}-${arch}`;
                    break;
                default:
                    core.setFailed('unsupported platform:' + platform);
                    return;
            }
            const archive = `cargo-make-v${cargoMakeVersion}-${arch}`;
            const url = `https://github.com/sagiegurari/cargo-make/releases/download/${cargoMakeVersion}/${archive}.zip`;
            console.log(`downloading ${url}`);
            const cargoMakeArchive = yield tc.downloadTool(url);
            const extractedFolder = yield tc.extractZip(cargoMakeArchive, tmpFolder);
            const exec = `cargo-make${exe_ext}`;
            const execPath = path.join(execFolder, exec);
            yield io.mv(path.join(extractedFolder, archTopFolder, exec), execPath).then(() => io.rmRF(path.join(extractedFolder, archive)));
            core.debug(`installed: ${execPath}`);
        }
        catch (error) {
            console.error(error);
            core.setFailed(error.message);
        }
        finally {
            io.rmRF(tmpFolder);
        }
    });
}
run().then(() => console.log("done"), (err) => console.error(err));
