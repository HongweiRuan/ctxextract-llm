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
const vitest_1 = require("vitest");
const lspClient = __importStar(require("../src/main"));
const main_1 = require("../src/main");
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const url_1 = require("url");
const rootPath = path.resolve(path.join(__dirname, 'mock'));
let process;
let endpoint;
let client;
(0, vitest_1.beforeAll)(async () => {
    // start the LSP server
    process = (0, child_process_1.spawn)(path.join(__dirname, '../', 'node_modules', '.bin', 'typescript-language-server'), ['--stdio'], {
        shell: true,
        stdio: 'pipe'
    });
    // create an RPC endpoint for the process
    endpoint = new lspClient.JSONRPCEndpoint(process.stdin, process.stdout);
    // create the LSP client
    client = new main_1.LspClient(endpoint);
    const result = await client.initialize({
        processId: process.pid,
        capabilities: {},
        clientInfo: {
            name: 'lspClientExample',
            version: '0.0.9'
        },
        workspaceFolders: [
            {
                name: 'workspace',
                uri: (0, url_1.pathToFileURL)(rootPath).href
            }
        ],
        rootUri: null,
        initializationOptions: {
            tsserver: {
                logDirectory: '.log',
                logVerbosity: 'verbose',
                trace: 'verbose'
            }
        }
    });
    (0, vitest_1.expect)(result.capabilities).toBeDefined();
});
(0, vitest_1.describe)('language features', () => {
    const docUri = (0, url_1.pathToFileURL)(path.join(rootPath, '_fake.ts')).href;
    const impUri = (0, url_1.pathToFileURL)(path.join(rootPath, 'example.ts')).href.replace(/\/([A-Z]):/, (v) => v.substring(0, v.length - 1).toLocaleLowerCase() + '%3A');
    const content = `import func from './example';\r\n` +
        `func(1,2);\r\n` +
        `export default function meth(a: number, b: number): boolean {\r\n` +
        `  return !!a && !!b;\r\n` +
        `}\r\n` +
        `meth(1,2);`;
    (0, vitest_1.beforeAll)(async () => {
        {
            // open a pseudo document
            await client.didOpen({
                textDocument: {
                    uri: docUri,
                    text: content,
                    version: 1,
                    languageId: 'typescript'
                }
            });
            const result = await client.once('textDocument/publishDiagnostics');
            (0, vitest_1.expect)(result).toEqual([{
                    uri: docUri,
                    diagnostics: []
                }]);
        }
    });
    (0, vitest_1.it)('Goto Definition Request', async () => {
        const result = await client.definition({
            position: {
                line: 1,
                character: 0
            },
            textDocument: {
                uri: docUri
            },
        });
        // finds part of the import statement
        (0, vitest_1.expect)(result).toEqual([{
                uri: impUri,
                range: {
                    start: { line: 6, character: 24 },
                    end: { line: 6, character: 28 }
                }
            }]);
    });
    (0, vitest_1.it)('Signature Help', async () => {
        {
            const result = await client.signatureHelp({
                textDocument: {
                    uri: docUri
                },
                position: {
                    line: 1,
                    character: 5
                },
                context: {
                    triggerKind: main_1.SignatureHelpTriggerKind.ContentChange,
                    isRetrigger: false,
                    triggerCharacter: '('
                }
            });
            (0, vitest_1.expect)(result).not.toBeNull();
            (0, vitest_1.expect)(result).toEqual({
                activeSignature: 0,
                activeParameter: 0,
                signatures: [
                    {
                        label: 'func(a: number, b: number): boolean',
                        documentation: {
                            kind: 'markdown',
                            value: 'This is some example documentation\n' +
                                '\n' +
                                '*@return* — example return documentation'
                        },
                        parameters: [
                            {
                                documentation: {
                                    kind: 'markdown',
                                    value: 'example argument documentation'
                                },
                                label: 'a: number'
                            },
                            {
                                label: 'b: number'
                            }
                        ]
                    }
                ]
            });
        }
    });
    (0, vitest_1.it)('Signature Help (inline)', async () => {
        {
            const result = await client.signatureHelp({
                textDocument: {
                    uri: docUri
                },
                position: {
                    line: 5,
                    character: 5
                },
                context: {
                    triggerKind: main_1.SignatureHelpTriggerKind.ContentChange,
                    isRetrigger: false,
                    triggerCharacter: '('
                }
            });
            (0, vitest_1.expect)(result).not.toBeNull();
            (0, vitest_1.expect)(result).toEqual({
                activeSignature: 0,
                activeParameter: 0,
                signatures: [
                    {
                        label: 'meth(a: number, b: number): boolean',
                        parameters: [
                            {
                                label: 'a: number'
                            },
                            {
                                label: 'b: number'
                            }
                        ]
                    }
                ]
            });
        }
    });
});
//# sourceMappingURL=lspClientExample.test.js.map