"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonRpcTransform_1 = require("../src/jsonRpcTransform");
const stream_1 = require("stream");
const events_1 = require("events");
const vitest_1 = require("vitest");
const mockReadStreamOK = (jsonRPC) => {
    const readable = new stream_1.Readable();
    const jsonRPCs = Array.isArray(jsonRPC) ? jsonRPC : [jsonRPC];
    jsonRPCs.forEach(j => {
        if ((typeof (j) !== 'string')) {
            const jsonRPCStr = JSON.stringify(j);
            readable.push(`Content-Length: ${jsonRPCStr.length}\r\n\r\n${jsonRPCStr}`);
        }
        else {
            readable.push(j);
        }
    });
    readable.push(null);
    return readable;
};
const mockReadStreamKO = (jsonRPC) => {
    const readable = new stream_1.Readable();
    const jsonRPCStr = JSON.stringify(jsonRPC);
    readable.push(`Content-Length: invalid\r\n\r\n${jsonRPCStr}`);
    readable.push(null);
    return readable;
};
(0, vitest_1.describe)('JSONRPCTransform', () => {
    (0, vitest_1.it)('unpacks a raw JSON RPC response into an JSONRPCResponse instance', async () => {
        const response = { "jsonrpc": "2.0", "id": 0, "result": {
                "capabilities": { "textDocumentSync": 1, "hoverProvider": true, "completionProvider": { "resolveProvider": false, "triggerCharacters": ["."] }, "definitionProvider": true, "referencesProvider": true, "documentSymbolProvider": true, "codeActionProvider": { "codeActionKinds": ["quickfix", "refactor.extract"] }, "codeLensProvider": { "resolveProvider": false }, "renameProvider": true }
            } };
        const jsonRpcTransform = jsonRpcTransform_1.JSONRPCTransform.createStream(mockReadStreamOK(response));
        const jsonrpc = (await (0, events_1.once)(jsonRpcTransform, 'data'))[0];
        (0, vitest_1.expect)(jsonrpc).toEqual(JSON.stringify(response));
    });
    (0, vitest_1.it)('unpacks a raw JSON RPC request into an JSONRPCRequest instance', async () => {
        const request = { "jsonrpc": "2.0", "method": "telemetry/event", "params": { "properties": { "Feature": "ApexPrelude-startup", "Exception": "None" }, "measures": { "ExecutionTime": 2673 } } };
        const jsonRpcTransform = jsonRpcTransform_1.JSONRPCTransform.createStream(mockReadStreamOK(request));
        const jsonrpc = (await (0, events_1.once)(jsonRpcTransform, 'data'))[0];
        (0, vitest_1.expect)(jsonrpc).toEqual(JSON.stringify(request));
    });
    (0, vitest_1.it)('throws an error with a bad header', async () => {
        const request = { "jsonrpc": "2.0", "method": "telemetry/event", "params": { "properties": { "Feature": "ApexPrelude-startup", "Exception": "None" }, "measures": { "ExecutionTime": 2673 } } };
        const jsonRpcTransform = jsonRpcTransform_1.JSONRPCTransform.createStream(mockReadStreamKO(request));
        const errorMessage = (await (0, events_1.once)(jsonRpcTransform, 'error'))[0];
        (0, vitest_1.expect)(errorMessage.message).toContain('Bad header');
    });
    (0, vitest_1.it)('calls callback more than once with multiple JSONRPCs', async () => {
        const response = {
            "jsonrpc": "2.0", "id": 1, "result": {
                "capabilities": { "textDocumentSync": 1, "hoverProvider": true, "completionProvider": { "resolveProvider": false, "triggerCharacters": ["."] }, "definitionProvider": true, "referencesProvider": true, "documentSymbolProvider": true, "codeActionProvider": { "codeActionKinds": ["quickfix", "refactor.extract"] }, "codeLensProvider": { "resolveProvider": false }, "renameProvider": true }
            }
        };
        const request = { "jsonrpc": "2.0", "method": "telemetry/event", "params": { "properties": { "Feature": "ApexPrelude-startup", "Exception": "None" }, "measures": { "ExecutionTime": 3000 } } };
        const payload = [response, request];
        const jsonRpcTransform = jsonRpcTransform_1.JSONRPCTransform.createStream(mockReadStreamOK(payload));
        let payloadIdx = 0;
        for await (const j of jsonRpcTransform) {
            (0, vitest_1.expect)(j).toEqual(JSON.stringify(payload[payloadIdx++]));
        }
    });
    (0, vitest_1.it)('process multiple JSONs in one _transform', async () => {
        const response = {
            "jsonrpc": "2.0", "id": 1, "result": {
                "capabilities": { "textDocumentSync": 1, "hoverProvider": true, "completionProvider": { "resolveProvider": false, "triggerCharacters": ["."] }, "definitionProvider": true, "referencesProvider": true, "documentSymbolProvider": true, "codeActionProvider": { "codeActionKinds": ["quickfix", "refactor.extract"] }, "codeLensProvider": { "resolveProvider": false }, "renameProvider": true }
            }
        };
        const request = { "jsonrpc": "2.0", "method": "telemetry/event", "params": { "properties": { "Feature": "ApexPrelude-startup", "Exception": "None" }, "measures": { "ExecutionTime": 3000 } } };
        const jsonRpcResponseStr = JSON.stringify(response);
        const jsonRpcRequestStr = JSON.stringify(request);
        const payload = [request, response];
        const payloadSingle = `Content-Length: ${jsonRpcRequestStr.length}\r\n\r\n${jsonRpcRequestStr}Content-Length: ${jsonRpcResponseStr.length}\r\n\r\n${jsonRpcResponseStr}`;
        const jsonRpcTransform = jsonRpcTransform_1.JSONRPCTransform.createStream(mockReadStreamOK(payloadSingle));
        let payloadIdx = 0;
        for await (const j of jsonRpcTransform) {
            (0, vitest_1.expect)(j).toEqual(JSON.stringify(payload[payloadIdx++]));
        }
    });
    (0, vitest_1.it)('buffers partial JSONs', async () => {
        const response = {
            "jsonrpc": "2.0", "id": 1, "result": {
                "capabilities": { "textDocumentSync": 1, "hoverProvider": true, "completionProvider": { "resolveProvider": false, "triggerCharacters": ["."] }, "definitionProvider": true, "referencesProvider": true, "documentSymbolProvider": true, "codeActionProvider": { "codeActionKinds": ["quickfix", "refactor.extract"] }, "codeLensProvider": { "resolveProvider": false }, "renameProvider": true }
            }
        };
        const request = { "jsonrpc": "2.0", "method": "telemetry/event", "params": { "properties": { "Feature": "ApexPrelude-startup", "Exception": "None" }, "measures": { "ExecutionTime": 3000 } } };
        const jsonRpcResponseStr = JSON.stringify(response);
        const jsonRpcRequestStr = JSON.stringify(request);
        const payload = [response, request];
        const payloadSplit = [`Content-Length: ${jsonRpcResponseStr.length}\r\n\r\n${jsonRpcResponseStr}Content-Length: ${jsonRpcRequestStr.length}\r\n\r\n${jsonRpcRequestStr.substring(0, 50)}`, jsonRpcRequestStr.substring(50)];
        const jsonRpcTransform = jsonRpcTransform_1.JSONRPCTransform.createStream(mockReadStreamOK(payloadSplit));
        let payloadIdx = 0;
        for await (const j of jsonRpcTransform) {
            (0, vitest_1.expect)(j).toEqual(JSON.stringify(payload[payloadIdx++]));
        }
    });
    (0, vitest_1.it)('buffers partial JSONs within the same RPC', async () => {
        const response = {
            "jsonrpc": "2.0", "id": 1, "result": {
                "capabilities": { "textDocumentSync": 1, "hoverProvider": true, "completionProvider": { "resolveProvider": false, "triggerCharacters": ["."] }, "definitionProvider": true, "referencesProvider": true, "documentSymbolProvider": true, "codeActionProvider": { "codeActionKinds": ["quickfix", "refactor.extract"] }, "codeLensProvider": { "resolveProvider": false }, "renameProvider": true }
            }
        };
        const request = { "jsonrpc": "2.0", "method": "telemetry/event", "params": { "properties": { "Feature": "ApexPrelude-startup", "Exception": "None" }, "measures": { "ExecutionTime": 3000 } } };
        const jsonRpcResponseStr = JSON.stringify(response);
        const jsonRpcRequestStr = JSON.stringify(request);
        const payload = [response, request];
        const payloadSplit = [`Content-Length: ${jsonRpcResponseStr.length}\r\n\r\n${jsonRpcResponseStr}`, `Content-Length: ${jsonRpcRequestStr.length}\r\n\r\n${jsonRpcRequestStr.substring(0, 50)}`, jsonRpcRequestStr.substring(50)];
        const jsonRpcTransform = jsonRpcTransform_1.JSONRPCTransform.createStream(mockReadStreamOK(payloadSplit));
        let payloadIdx = 0;
        for await (const j of jsonRpcTransform) {
            (0, vitest_1.expect)(j).toEqual(JSON.stringify(payload[payloadIdx++]));
        }
    });
});
//# sourceMappingURL=jsonRpcTransform.test.js.map