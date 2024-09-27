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
exports.extractWithNew = exports.extractWithCodeQL = exports.extract = void 0;
const main_js_1 = require("../ts-lsp-client-dist/src/main.js");
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const core_1 = require("./core");
const codeql_1 = require("./codeql");
const constants_1 = require("./constants");
const app_1 = require("./app");
// sketchPath: /home/<username>/path/to/sketch/dir/sketch.ts
const extract = async (sketchPath) => {
    const logFile = fs.createWriteStream("log.txt");
    const rootPath = path.dirname(sketchPath);
    const rootUri = `file://${rootPath}`;
    const sketchFileName = path.basename(sketchPath);
    const workspaceFolders = [{ 'name': 'context-extractor', 'uri': rootUri }];
    // initialize LS client and server
    const r = (0, child_process_1.spawn)('typescript-language-server', ['--stdio']);
    const e = new main_js_1.JSONRPCEndpoint(r.stdin, r.stdout);
    const c = new main_js_1.LspClient(e);
    console.log(JSON.stringify(c));
    const capabilities = {
        'textDocument': {
            'codeAction': { 'dynamicRegistration': true },
            'codeLens': { 'dynamicRegistration': true },
            'colorProvider': { 'dynamicRegistration': true },
            'completion': {
                'completionItem': {
                    'commitCharactersSupport': true,
                    'documentationFormat': ['markdown', 'plaintext'],
                    'snippetSupport': true
                },
                'completionItemKind': {
                    'valueSet': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
                },
                'contextSupport': true,
                'dynamicRegistration': true
            },
            'definition': { 'dynamicRegistration': true },
            'documentHighlight': { 'dynamicRegistration': true },
            'documentLink': { 'dynamicRegistration': true },
            'documentSymbol': {
                'dynamicRegistration': true,
                'symbolKind': {
                    'valueSet': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
                }
            },
            'formatting': { 'dynamicRegistration': true },
            'hover': {
                'contentFormat': ['markdown', 'plaintext'],
                'dynamicRegistration': true
            },
            'implementation': { 'dynamicRegistration': true },
            // 'inlayhint': { 'dynamicRegistration': true },
            'onTypeFormatting': { 'dynamicRegistration': true },
            'publishDiagnostics': { 'relatedInformation': true },
            'rangeFormatting': { 'dynamicRegistration': true },
            'references': { 'dynamicRegistration': true },
            'rename': { 'dynamicRegistration': true },
            'signatureHelp': {
                'dynamicRegistration': true,
                'signatureInformation': { 'documentationFormat': ['markdown', 'plaintext'] }
            },
            'synchronization': {
                'didSave': true,
                'dynamicRegistration': true,
                'willSave': true,
                'willSaveWaitUntil': true
            },
            'typeDefinition': { 'dynamicRegistration': true, 'linkSupport': true },
            // 'typeHierarchy': { 'dynamicRegistration': true }
        },
        'workspace': {
            'applyEdit': true,
            'configuration': true,
            'didChangeConfiguration': { 'dynamicRegistration': true },
            'didChangeWatchedFiles': { 'dynamicRegistration': true },
            'executeCommand': { 'dynamicRegistration': true },
            'symbol': {
                'dynamicRegistration': true,
                'symbolKind': {
                    'valueSet': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
                }
            }, 'workspaceEdit': { 'documentChanges': true },
            'workspaceFolders': true
        },
        'general': {
            'positionEncodings': ['utf-8']
        },
    };
    r.stdout.on('data', (d) => logFile.write(d));
    await c.initialize({
        processId: process.pid,
        capabilities: capabilities,
        trace: 'off',
        rootUri: null,
        workspaceFolders: workspaceFolders,
        initializationOptions: {
            preferences: {
                includeInlayVariableTypeHints: true
            }
        }
    });
    // inject hole function
    const injectedSketchPath = `${rootPath}/injected_${sketchFileName}`;
    const injectedSketchUri = `file://${injectedSketchPath}`;
    const sketchFileContent = fs.readFileSync(sketchPath, "utf8");
    const injectedSketchFileContent = `declare function _<T>(): T\n${sketchFileContent}`;
    fs.writeFileSync(injectedSketchPath, injectedSketchFileContent);
    // doucment sync client and server by notifying that the client has opened all the files inside the target directory
    fs.readdirSync(rootPath).map(fileName => {
        if (fs.lstatSync(`${rootPath}/${fileName}`).isFile()) {
            c.didOpen({
                textDocument: {
                    uri: `file://${rootPath}/${fileName}`,
                    languageId: 'typescript',
                    text: fs.readFileSync(`${rootPath}/${fileName}`).toString("ascii"),
                    version: 1
                }
            });
        }
    });
    // get context of the hole
    // currently only matching ES6 arrow functions
    const holeContext = await (0, core_1.getHoleContext)(c, injectedSketchUri, injectedSketchFileContent);
    // console.log(holeContext);
    // rewrite hole function after context has been extracted to make LSP work
    const trueHoleFunction = `declare function _(): ${holeContext.functionTypeSpan}`;
    const trueInjectedSketchFileContent = `${trueHoleFunction}\n${sketchFileContent}`;
    fs.writeFileSync(injectedSketchPath, trueInjectedSketchFileContent);
    c.didChange({
        textDocument: {
            uri: injectedSketchUri,
            version: 2
        },
        contentChanges: [{
                text: trueInjectedSketchFileContent
            }]
    });
    // recursively define relevant types
    const outputFile = fs.createWriteStream("output.txt");
    // const foundSoFar = new Map<string, string>();
    const relevantTypes = await (0, core_1.extractRelevantTypes)(c, holeContext.fullHoverResult, holeContext.functionName, holeContext.functionTypeSpan, 0, "declare function _(): ".length, new Map(), injectedSketchUri, outputFile, 1);
    relevantTypes.delete("_");
    relevantTypes.delete("_()");
    for (const [k, v] of relevantTypes.entries()) {
        relevantTypes.set(k, v.slice(0, -1));
    }
    // console.log("relevantTypes:", relevantTypes);
    // logFile.end();
    // logFile.close();
    // outputFile.end();
    // outputFile.close();
    const preludeContent = fs.readFileSync(`${rootPath}/prelude.ts`).toString("utf8");
    const relevantHeaders = (0, core_1.extractRelevantHeaders)(preludeContent, relevantTypes, holeContext.functionTypeSpan);
    for (const [k, v] of relevantTypes.entries()) {
        relevantTypes.set(k, v + ";");
    }
    for (let i = 0; i < relevantHeaders.length; ++i) {
        relevantHeaders[i] += ";";
    }
    // console.log(relevantContext);
    // return { holeContext: holeContext, relevantTypes: Array.from(relevantTypes), relevantContext: relevantContext };
    return { hole: holeContext.functionTypeSpan, relevantTypes: Array.from(relevantTypes, ([k, v]) => { return v; }), relevantHeaders: relevantHeaders };
};
exports.extract = extract;
const extractWithCodeQL = async (sketchPath) => {
    const start = Date.now();
    console.log("ROOT_DIR: ", constants_1.ROOT_DIR);
    console.log("DEPS_DIR: ", constants_1.DEPS_DIR);
    console.log("CODEQL_PATH: ", constants_1.CODEQL_PATH);
    const targetPath = path.dirname(sketchPath);
    try {
        // extraction
        const databasePath = (0, codeql_1.createDatabaseWithCodeQL)(constants_1.CODEQL_PATH, targetPath);
        const holeType = (0, codeql_1.extractHoleType)(constants_1.CODEQL_PATH, path.join(constants_1.QUERY_DIR, "hole.ql"), databasePath, targetPath);
        // console.log("holeType: ", holeType);
        const relevantTypes = (0, codeql_1.extractRelevantTypesWithCodeQL)(constants_1.CODEQL_PATH, path.join(constants_1.QUERY_DIR, "relevant-types.ql"), databasePath, targetPath);
        // console.log("relevantTypes: ", Array.from(relevantTypes, ([k, v]) => { return v.typeAliasDeclaration; }));
        // console.log("relevantTypes: ", relevantTypes)
        const headers = (0, codeql_1.extractHeadersWithCodeQL)(constants_1.CODEQL_PATH, path.join(constants_1.QUERY_DIR, "vars.ql"), databasePath, targetPath);
        // console.log("headers: ", headers)
        // const relevantContext = extractRelevantContextWithCodeQL(CODEQL_PATH, path.join(QUERY_DIR, "types.ql"), databasePath, targetPath, headers, relevantTypes);
        // console.log("relevantContext: ", relevantContext);
        // const relevantHeaders = getRelevantHeaders(CODEQL_PATH, path.join(QUERY_DIR, "types.ql"), databasePath, targetPath, headers, holeType);
        // console.log("relevantHeaders: ", relevantHeaders);
        const knownTypeLocations = (0, codeql_1.extractTypesAndLocations)(constants_1.CODEQL_PATH, path.join(constants_1.QUERY_DIR, "imports.ql"), databasePath, targetPath);
        // console.log("known type locations: ", knownTypeLocations)
        // NOTE: switch between the two header extraction methods
        // const relevantHeaders = getRelevantHeaders3(CODEQL_PATH, path.join(QUERY_DIR, "types.ql"), databasePath, targetPath, headers, holeType, relevantTypes);
        // console.log("relevantHeaders: ", Array.from(relevantHeaders));
        const relevantHeaders = (0, codeql_1.getRelevantHeaders4)(constants_1.CODEQL_PATH, constants_1.QUERY_DIR, databasePath, targetPath, headers, holeType, relevantTypes, knownTypeLocations);
        // console.log("relevantHeaders: ", Array.from(relevantHeaders));
        const end = Date.now();
        // console.log("end: ", end)
        // console.log("elapsed: ", end - start)
        return { hole: holeType.typeName, relevantTypes: Array.from(relevantTypes, ([k, v]) => { return JSON.stringify(v); }), relevantHeaders: Array.from(relevantHeaders) };
    }
    catch (err) {
        console.error(`${targetPath}: ${err}`);
    }
};
exports.extractWithCodeQL = extractWithCodeQL;
const extractWithNew = async (language, sketchPath, credentialsPath) => {
    const app = new app_1.App(language, sketchPath, credentialsPath);
    await app.run();
    const res = app.getSavedResult();
    if (res) {
        const completion = await app.completeWithLLM(path.dirname(sketchPath), res);
        return { context: res, completion: completion };
    }
    app.close();
    return { context: null, completion: null };
    // return app.getSavedResult();
};
exports.extractWithNew = extractWithNew;
//# sourceMappingURL=main.js.map