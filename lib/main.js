"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const httpm = __importStar(require("@actions/http-client"));
// import * as github from '@actions/github'
const io = __importStar(require("@actions/io"));
const tc = __importStar(require("@actions/tool-cache"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
function findVersionLatest() {
    return __awaiter(this, void 0, void 0, function* () {
        core.info(`search latest version of cargo-make`);
        let version = null;
        const url = 'https://api.github.com/repos/sagiegurari/cargo-make/releases/latest';
        // octokit require a token also for public (anonymous endpoint)
        // const octokit = new github.GitHub('myToken', {auth: 'no-token'})
        // const {data} = await octokit.repos.getLatestRelease({
        //   owner: 'sagiegurari',
        //   repo: 'cargo-make'
        // })
        const http = new httpm.HttpClient('http-client-github-actions');
        const res = yield http.get(url);
        if (res.message.statusCode == 200) {
            const body = yield res.readBody();
            version = JSON.parse(body).tag_name;
            core.debug(`latest cargo-make release found: ${version}`);
        }
        return Promise.resolve(version || '0.30.7');
    });
}
function findVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputVersion = core.getInput('version');
        if (inputVersion === 'latest' ||
            inputVersion == null ||
            inputVersion === undefined) {
            return findVersionLatest();
        }
        return Promise.resolve(inputVersion);
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const tmpFolder = path.join(os.tmpdir(), 'setup-rust-cargo-make');
        yield io.mkdirP(tmpFolder);
        try {
            const cargoMakeVersion = yield findVersion();
            core.info(`installing cargo-make ${cargoMakeVersion} ...`);
            const platform = process.env['PLATFORM'] || process.platform;
            core.debug(platform);
            const execFolder = path.join(os.homedir(), '.cargo', 'bin');
            core.debug(execFolder);
            yield io.mkdirP(execFolder);
            let exeExt = '';
            let arch = 'noarch';
            let archTopFolder = '';
            switch (platform) {
                case 'win32':
                    arch = 'x86_64-pc-windows-msvc';
                    archTopFolder = '';
                    exeExt = '.exe';
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
                    core.setFailed(`unsupported platform: ${platform}`);
                    return;
            }
            const archive = `cargo-make-v${cargoMakeVersion}-${arch}`;
            const url = `https://github.com/sagiegurari/cargo-make/releases/download/${cargoMakeVersion}/${archive}.zip`;
            core.info(`downloading ${url}`);
            const cargoMakeArchive = yield tc.downloadTool(url);
            const extractedFolder = yield tc.extractZip(cargoMakeArchive, tmpFolder);
            const exec = `cargo-make${exeExt}`;
            const execPath = path.join(execFolder, exec);
            yield io
                .mv(path.join(extractedFolder, archTopFolder, exec), execPath)
                .then(() => __awaiter(this, void 0, void 0, function* () { return io.rmRF(path.join(extractedFolder, archive)); }));
            core.debug(`installed: ${execPath}`);
        }
        catch (error) {
            core.error(error);
            core.setFailed(error.message);
        }
        finally {
            io.rmRF(tmpFolder);
        }
    });
}
run().then(() => core.info('done'), err => core.error(err));
