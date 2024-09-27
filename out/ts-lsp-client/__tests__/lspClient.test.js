"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const jsonRpcEndpoint_1 = require("../src/jsonRpcEndpoint");
const lspClient_1 = require("../src/lspClient");
const models_1 = require("../src/models");
const vitest_1 = require("vitest");
class WriteMemory extends stream_1.Writable {
    _buffer;
    constructor() {
        super();
        this._buffer = '';
    }
    _write(chunk, _, next) {
        this._buffer += chunk;
        next();
    }
    reset() {
        this._buffer = '';
    }
    buffer() {
        return this._buffer;
    }
}
(0, vitest_1.describe)('LspClient', () => {
    (0, vitest_1.it)('sends a LSP Initialize request', async () => {
        const mockWriteStream = new WriteMemory();
        const mockReadStream = new stream_1.Readable();
        const initResponse = {
            "jsonrpc": "2.0", "id": 0, "result": {
                "capabilities": { "textDocumentSync": 1, "hoverProvider": true, "completionProvider": { "resolveProvider": false, "triggerCharacters": ["."] }, "definitionProvider": true, "referencesProvider": true, "documentSymbolProvider": true, "codeActionProvider": { "codeActionKinds": ["quickfix", "refactor.extract"] }, "codeLensProvider": { "resolveProvider": false }, "renameProvider": true }
            }
        };
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new lspClient_1.LspClient(e);
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
                        'valueSet': [1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12,
                            13,
                            14,
                            15,
                            16,
                            17,
                            18,
                            19,
                            20,
                            21,
                            22,
                            23,
                            24,
                            25]
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
                        'valueSet': [1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12,
                            13,
                            14,
                            15,
                            16,
                            17,
                            18,
                            19,
                            20,
                            21,
                            22,
                            23,
                            24,
                            25,
                            26]
                    }
                },
                'formatting': { 'dynamicRegistration': true },
                'hover': {
                    'contentFormat': ['markdown', 'plaintext'],
                    'dynamicRegistration': true
                },
                'implementation': { 'dynamicRegistration': true },
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
                'typeDefinition': { 'dynamicRegistration': true }
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
                        'valueSet': [1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12,
                            13,
                            14,
                            15,
                            16,
                            17,
                            18,
                            19,
                            20,
                            21,
                            22,
                            23,
                            24,
                            25,
                            26]
                    }
                }, 'workspaceEdit': { 'documentChanges': true },
                'workspaceFolders': true
            }
        };
        const root_uri = 'file:////random/folder';
        const workspaceFolders = [{ 'name': 'my-workspace', 'uri': root_uri }];
        const initResRPCMessage = { "jsonrpc": "2.0", "result": initResponse, "id": 0 };
        mockReadStream.push(`Content-Length: ${JSON.stringify(initResRPCMessage).length}\r\n\r\n${JSON.stringify(initResRPCMessage)}`);
        mockReadStream.push(null);
        const response = await client.initialize({
            processId: -1,
            rootPath: '.',
            rootUri: null,
            capabilities: capabilities,
            trace: 'off',
            workspaceFolders: workspaceFolders
        });
        (0, vitest_1.expect)(JSON.stringify(initResponse)).toEqual(JSON.stringify(response));
    });
    (0, vitest_1.it)('sends a LSP Initialized notification', async () => {
        const mockWriteStream = new WriteMemory();
        const mockReadStream = new stream_1.Readable();
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new lspClient_1.LspClient(e);
        client.initialized();
        mockReadStream.push(null);
        const initializedNotification = { "jsonrpc": "2.0", "method": "initialized" };
        (0, vitest_1.expect)(mockWriteStream.buffer()).toBe(`Content-Length: ${JSON.stringify(initializedNotification).length}\r\n\r\n${JSON.stringify(initializedNotification)}`);
    });
    (0, vitest_1.it)('sends a LSP Shutdown request', async () => {
        const mockWriteStream = new WriteMemory();
        const mockReadStream = new stream_1.Readable();
        const shutdownRespose = {
            "jsonrpc": "2.0", "id": 0, "result": {}
        };
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new lspClient_1.LspClient(e);
        mockReadStream.push(`Content-Length: ${JSON.stringify(shutdownRespose).length}\r\n\r\n${JSON.stringify(shutdownRespose)}`);
        mockReadStream.push(null);
        const response = await client.shutdown();
        (0, vitest_1.expect)(response).toEqual({});
    });
    (0, vitest_1.it)('sends a LSP Exit notification', async () => {
        const mockWriteStream = new WriteMemory();
        const mockReadStream = new stream_1.Readable();
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new lspClient_1.LspClient(e);
        client.exit();
        mockReadStream.push(null);
        const exitNotification = { "jsonrpc": "2.0", "method": "exit" };
        (0, vitest_1.expect)(mockWriteStream.buffer()).toBe(`Content-Length: ${JSON.stringify(exitNotification).length}\r\n\r\n${JSON.stringify(exitNotification)}`);
    });
    (0, vitest_1.it)('sends a LSP textDocument/didOpen notification', async () => {
        const mockWriteStream = new WriteMemory();
        const mockReadStream = new stream_1.Readable();
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new lspClient_1.LspClient(e);
        const didOpenParams = {
            textDocument: {
                uri: 'file:///fake-file.js',
                languageId: 'js',
                text: 'console.log("Hello, World!");',
                version: 1
            }
        };
        client.didOpen(didOpenParams);
        mockReadStream.push(null);
        const didOpenNotification = { "jsonrpc": "2.0", "method": "textDocument/didOpen", params: didOpenParams };
        (0, vitest_1.expect)(mockWriteStream.buffer()).toBe(`Content-Length: ${JSON.stringify(didOpenNotification).length}\r\n\r\n${JSON.stringify(didOpenNotification)}`);
    });
    (0, vitest_1.it)('sends a LSP textDocument/didClose notification', async () => {
        const mockWriteStream = new WriteMemory();
        const mockReadStream = new stream_1.Readable();
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new lspClient_1.LspClient(e);
        const didCloseParams = {
            textDocument: {
                uri: 'file:///fake-file.js',
            }
        };
        client.didClose(didCloseParams);
        mockReadStream.push(null);
        const didOpenNotification = { "jsonrpc": "2.0", "method": "textDocument/didClose", params: didCloseParams };
        (0, vitest_1.expect)(mockWriteStream.buffer()).toBe(`Content-Length: ${JSON.stringify(didOpenNotification).length}\r\n\r\n${JSON.stringify(didOpenNotification)}`);
    });
    (0, vitest_1.it)('sends a LSP textDocument/documentSymbol request', async () => {
        const mockWriteStream = new WriteMemory();
        const mockReadStream = new stream_1.Readable();
        const resDocumentSymbol = [{
                kind: models_1.SymbolKind.Array,
                name: 'anArray',
                range: {
                    start: {
                        line: 1,
                        character: 1
                    },
                    end: {
                        line: 1,
                        character: 10
                    }
                },
                selectionRange: {
                    start: {
                        line: 1,
                        character: 1
                    },
                    end: {
                        line: 1,
                        character: 10
                    }
                }
            }];
        const documentSymbolRespose = {
            "jsonrpc": "2.0", "id": 0, "result": resDocumentSymbol
        };
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new lspClient_1.LspClient(e);
        mockReadStream.push(`Content-Length: ${JSON.stringify(documentSymbolRespose).length}\r\n\r\n${JSON.stringify(documentSymbolRespose)}`);
        mockReadStream.push(null);
        const response = await client.documentSymbol({
            textDocument: {
                uri: 'file:///fake-file.js'
            }
        });
        (0, vitest_1.expect)(response).toEqual(resDocumentSymbol);
    });
    (0, vitest_1.it)('sends a LSP textDocument/references request', async () => {
        const mockWriteStream = new WriteMemory();
        const mockReadStream = new stream_1.Readable();
        const resReferences = [{
                range: {
                    start: {
                        line: 1,
                        character: 1
                    },
                    end: {
                        line: 1,
                        character: 10
                    }
                },
                uri: 'file:///other-fake-file.js'
            }];
        const referencesRespose = {
            "jsonrpc": "2.0", "id": 0, "result": resReferences
        };
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new lspClient_1.LspClient(e);
        mockReadStream.push(`Content-Length: ${JSON.stringify(referencesRespose).length}\r\n\r\n${JSON.stringify(referencesRespose)}`);
        mockReadStream.push(null);
        const response = await client.references({
            textDocument: {
                uri: 'file:///fake-file.js'
            },
            context: {
                includeDeclaration: false
            },
            position: {
                character: 1,
                line: 1
            }
        });
        (0, vitest_1.expect)(response).toEqual(resReferences);
    });
    (0, vitest_1.it)('sends a LSP textDocument/definition request', async () => {
        const mockWriteStream = new WriteMemory();
        const mockReadStream = new stream_1.Readable();
        const resDefinition = [{
                range: {
                    start: {
                        line: 1,
                        character: 1
                    },
                    end: {
                        line: 1,
                        character: 10
                    }
                },
                uri: 'file:///other-fake-file.js'
            }];
        const definitionRespose = {
            "jsonrpc": "2.0", "id": 0, "result": resDefinition
        };
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new lspClient_1.LspClient(e);
        mockReadStream.push(`Content-Length: ${JSON.stringify(definitionRespose).length}\r\n\r\n${JSON.stringify(definitionRespose)}`);
        mockReadStream.push(null);
        const response = await client.definition({
            textDocument: {
                uri: 'file:///fake-file.js'
            },
            position: {
                character: 1,
                line: 1
            }
        });
        (0, vitest_1.expect)(response).toEqual(resDefinition);
    });
    (0, vitest_1.it)('sends a LSP textDocument/typeDefinition request', async () => {
        const mockWriteStream = new WriteMemory();
        const mockReadStream = new stream_1.Readable();
        const resTypeDefinition = [{
                range: {
                    start: {
                        line: 1,
                        character: 1
                    },
                    end: {
                        line: 1,
                        character: 10
                    }
                },
                uri: 'file:///other-fake-file.js'
            }];
        const typeDefinitionRespose = {
            "jsonrpc": "2.0", "id": 0, "result": resTypeDefinition
        };
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new lspClient_1.LspClient(e);
        mockReadStream.push(`Content-Length: ${JSON.stringify(typeDefinitionRespose).length}\r\n\r\n${JSON.stringify(typeDefinitionRespose)}`);
        mockReadStream.push(null);
        const response = await client.typeDefinition({
            textDocument: {
                uri: 'file:///fake-file.js'
            },
            position: {
                character: 1,
                line: 1
            }
        });
        (0, vitest_1.expect)(response).toEqual(resTypeDefinition);
    });
    (0, vitest_1.it)('sends a LSP textDocument/signatureHelp request', async () => {
        const mockWriteStream = new WriteMemory();
        const mockReadStream = new stream_1.Readable();
        const resSignatureHelp = {
            signatures: [{
                    label: 'aLabel'
                }]
        };
        const signatureHelpRespose = {
            "jsonrpc": "2.0", "id": 0, "result": resSignatureHelp
        };
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new lspClient_1.LspClient(e);
        mockReadStream.push(`Content-Length: ${JSON.stringify(signatureHelpRespose).length}\r\n\r\n${JSON.stringify(signatureHelpRespose)}`);
        mockReadStream.push(null);
        const response = await client.signatureHelp({
            textDocument: {
                uri: 'file:///fake-file.js'
            },
            position: {
                character: 1,
                line: 1
            }
        });
        (0, vitest_1.expect)(response).toEqual(resSignatureHelp);
    });
    (0, vitest_1.it)('waits for a notification from LSP server', async () => {
        const mockWriteStream = new WriteMemory();
        const mockReadStream = new stream_1.Readable();
        const telemetryEventRequest = { "jsonrpc": "2.0", "method": "telemetry/event", "params": { "properties": { "Feature": "ApexPrelude-startup", "Exception": "None" }, "measures": { "ExecutionTime": 2673 } } };
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new lspClient_1.LspClient(e);
        mockReadStream.push(`Content-Length: ${JSON.stringify(telemetryEventRequest).length}\r\n\r\n${JSON.stringify(telemetryEventRequest)}`);
        mockReadStream.push(null);
        const telEventRes = (await client.once('telemetry/event'))[0];
        (0, vitest_1.expect)(telEventRes).toEqual(telemetryEventRequest.params);
    });
    (0, vitest_1.it)('sends a LSP textDocument/completion request', async () => {
        const mockWriteStream = new WriteMemory();
        const mockReadStream = new stream_1.Readable();
        const resCompletion = {
            isIncomplete: false,
            itemDefaults: {
                commitCharacters: [],
                editRange: {
                    insert: {
                        start: { line: 1, character: 1 },
                        end: { line: 1, character: 1 }
                    },
                    replace: {
                        start: { line: 1, character: 1 },
                        end: { line: 1, character: 1 }
                    }
                },
                insertTextFormat: 1,
                insertTextMode: 1,
                data: null,
            },
            items: [
                {
                    label: "someLabel",
                    labelDetails: { detail: "detail of someLabel", description: "description of someLabel" },
                    kind: 1,
                    tags: [],
                    detail: "",
                    documentation: "",
                    deprecated: false,
                    preselect: true,
                    sortText: "sortText",
                    filterText: "filterText",
                    insertText: "someLabel",
                    insertTextFormat: 1,
                    insertTextMode: 1,
                    textEdit: {
                        range: {
                            start: { line: 1, character: 1 },
                            end: { line: 1, character: 1 }
                        },
                        newText: ""
                    },
                    textEditText: "",
                    additionalTextEdits: [],
                    commitCharacters: [],
                    command: null,
                    data: null,
                }
            ]
        };
        const completionRespose = {
            "jsonrpc": "2.0", "id": 0, "result": resCompletion
        };
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const client = new lspClient_1.LspClient(e);
        mockReadStream.push(`Content-Length: ${JSON.stringify(completionRespose).length}\r\n\r\n${JSON.stringify(completionRespose)}`);
        mockReadStream.push(null);
        const response = await client.completion({
            textDocument: {
                uri: 'file:///fake-file.js'
            },
            position: {
                character: 1,
                line: 1
            },
            context: {
                triggerKind: 2,
                triggerCharacter: "."
            },
        });
        console.log(response);
        (0, vitest_1.expect)(response).toEqual(resCompletion);
    });
});
//# sourceMappingURL=lspClient.test.js.map