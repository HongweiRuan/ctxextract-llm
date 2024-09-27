"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const main_1 = require("../ts-lsp-client-dist/src/main");
const types_1 = require("./types");
// TODO: Bundle the drivers as barrel exports.
const typescript_driver_1 = require("./typescript-driver");
const ocaml_driver_1 = require("./ocaml-driver");
const utils_1 = require("./utils");
class App {
    language;
    languageDriver;
    lspClient;
    sketchPath; // not prefixed with file://
    // private result: {
    //   hole: string;
    //   relevantTypes: string[];
    //   relevantHeaders: string[];
    // } | null = null;
    result = null;
    credentialsPath;
    constructor(language, sketchPath, credentialsPath) {
        this.language = language;
        this.sketchPath = sketchPath;
        this.credentialsPath = credentialsPath;
        const r = (() => {
            switch (language) {
                case types_1.Language.TypeScript: {
                    this.languageDriver = new typescript_driver_1.TypeScriptDriver();
                    return (0, child_process_1.spawn)("typescript-language-server", ["--stdio"]);
                }
                case types_1.Language.OCaml: {
                    this.languageDriver = new ocaml_driver_1.OcamlDriver();
                    // TODO: Spawn a dune build -w on sketch directory.
                    const currDir = __dirname;
                    process.chdir(path.dirname(sketchPath));
                    (0, child_process_1.spawn)("dune", ["build", "-w"]);
                    process.chdir(currDir);
                    return (0, child_process_1.spawn)("ocamllsp", ["--stdio"]);
                }
            }
        })();
        const e = new main_1.JSONRPCEndpoint(r.stdin, r.stdout);
        const c = new main_1.LspClient(e);
        this.lspClient = c;
        const logFile = fs.createWriteStream("log.txt");
        r.stdout.on('data', (d) => logFile.write(d));
    }
    async init() {
        await this.languageDriver.init(this.lspClient, this.sketchPath, this.credentialsPath);
    }
    async run() {
        const outputFile = fs.createWriteStream("output.txt");
        await this.init();
        const holeContext = await this.languageDriver.getHoleContext(this.lspClient, this.sketchPath);
        const relevantTypes = await this.languageDriver.extractRelevantTypes(this.lspClient, holeContext.fullHoverResult, holeContext.functionName, holeContext.range.start.line, holeContext.range.end.line, new Map(), (0, utils_1.supportsHole)(this.language) ? `file://${this.sketchPath}` : `file://${path.dirname(this.sketchPath)}/injected_sketch${path.extname(this.sketchPath)}`, outputFile);
        // console.log(relevantTypes)
        // Postprocess the map.
        if (this.language === types_1.Language.TypeScript) {
            relevantTypes.delete("_()");
            for (const [k, v] of relevantTypes.entries()) {
                relevantTypes.set(k, v.slice(0, -1));
            }
        }
        else if (this.language === types_1.Language.OCaml) {
            relevantTypes.delete("_");
        }
        const relevantHeaders = await this.languageDriver.extractRelevantHeaders(this.lspClient, path.join(path.dirname(this.sketchPath), `prelude${path.extname(this.sketchPath)}`), relevantTypes, holeContext.functionTypeSpan);
        // Postprocess the map.
        if (this.language === types_1.Language.TypeScript) {
            relevantTypes.delete("");
            for (const [k, v] of relevantTypes.entries()) {
                relevantTypes.set(k, v + ";");
            }
            for (let i = 0; i < relevantHeaders.length; ++i) {
                relevantHeaders[i] += ";";
            }
        }
        this.result = {
            hole: holeContext.functionTypeSpan,
            relevantTypes: Array.from(relevantTypes, ([_, v]) => { return v; }),
            relevantHeaders: relevantHeaders
        };
    }
    close() {
        // TODO:
        this.lspClient.shutdown();
    }
    getSavedResult() {
        // console.log(this.result)
        return this.result;
    }
    async completeWithLLM(targetDirectoryPath, context) {
        return await this.languageDriver.completeWithLLM(targetDirectoryPath, context);
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map