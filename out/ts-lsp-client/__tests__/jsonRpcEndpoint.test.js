"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const stream_1 = require("stream");
const jsonRpcEndpoint_1 = require("../src/jsonRpcEndpoint");
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
const mockReadStreamOK = (jsonRPC, eof) => {
    const readable = new stream_1.Readable();
    const jsonRPCs = Array.isArray(jsonRPC) ? jsonRPC : [jsonRPC];
    jsonRPCs.forEach(j => {
        if ((typeof (j) !== 'string')) {
            const jsonRPCStr = JSON.stringify(j);
            readable.push(`Content-Length: ${jsonRPCStr.length}\r\n\r\n${jsonRPCStr}`);
        }
        else {
            //console.log(`j is string: ${j}`)
            readable.push(j);
        }
    });
    if (eof) {
        readable.push(null);
    }
    return readable;
};
(0, vitest_1.describe)('JSONRPCEndpoint', () => {
    (0, vitest_1.it)('sends a JSONRPC request', async () => {
        const mockWriteStream = new WriteMemory();
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStreamOK([], true));
        const message = { param1: 'value1', param2: { subParam1: 'subValue1' } };
        e.send('someMethod', message);
        const jsonRpcMessage = { "jsonrpc": "2.0", "id": 0, "method": "someMethod", "params": message };
        (0, vitest_1.expect)(mockWriteStream.buffer()).toBe(`Content-Length: ${JSON.stringify(jsonRpcMessage).length}\r\n\r\n${JSON.stringify(jsonRpcMessage)}`);
    });
    (0, vitest_1.it)('sends a JSONRPC notification', async () => {
        const mockWriteStream = new WriteMemory();
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStreamOK([], true));
        const message = { param1: 'value1', param2: { subParam1: 'subValue1' } };
        e.notify('someMethod', message);
        const jsonRpcMessage = { "jsonrpc": "2.0", "method": "someMethod", "params": message };
        (0, vitest_1.expect)(mockWriteStream.buffer()).toBe(`Content-Length: ${JSON.stringify(jsonRpcMessage).length}\r\n\r\n${JSON.stringify(jsonRpcMessage)}`);
    });
    (0, vitest_1.it)('sends a JSONRPC request with the matched response', async () => {
        const mockWriteStream = new WriteMemory();
        const mockReadStream = mockReadStreamOK([], false);
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const reqMessage = { param1: 'value1', param2: { subParam1: 'subValue1' } };
        const resMessage = { "responseParam1": 'resValue1' };
        const resRPCMessage = { "jsonrpc": "2.0", "result": resMessage, "id": 0 };
        mockReadStream.push(`Content-Length: ${JSON.stringify(resRPCMessage).length}\r\n\r\n${JSON.stringify(resRPCMessage)}`);
        mockReadStream.push(null);
        const response = await e.send('someMethod', reqMessage);
        (0, vitest_1.expect)(JSON.stringify(response)).toEqual(JSON.stringify(resMessage));
    });
    (0, vitest_1.it)('waits for a JSONRPC request from server', async () => {
        const mockWriteStream = new WriteMemory();
        const mockReadStream = mockReadStreamOK([], false);
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const reqMessage = { param1: 'value1', param2: { subParam1: 'subValue1' } };
        const reqRPCMessage = { "jsonrpc": "2.0", "method": "someNotifyMethod", "params": reqMessage };
        mockReadStream.push(`Content-Length: ${JSON.stringify(reqRPCMessage).length}\r\n\r\n${JSON.stringify(reqRPCMessage)}`);
        mockReadStream.push(null);
        const response = (await (0, events_1.once)(e, 'someNotifyMethod'))[0];
        (0, vitest_1.expect)(JSON.stringify(response)).toEqual(JSON.stringify(reqMessage));
    });
    (0, vitest_1.it)('emits an error with a mismatching JSONRPC response', async () => {
        const mockWriteStream = new WriteMemory();
        const mockReadStream = mockReadStreamOK([], false);
        const e = new jsonRpcEndpoint_1.JSONRPCEndpoint(mockWriteStream, mockReadStream);
        const reqMessage = { param1: 'value1', param2: { subParam1: 'subValue1' } };
        const resMessage = { "responseParam1": 'resValue1' };
        const resRPCMessage = { "jsonrpc": "2.0", "result": resMessage, "id": 10 };
        mockReadStream.push(`Content-Length: ${JSON.stringify(resRPCMessage).length}\r\n\r\n${JSON.stringify(resRPCMessage)}`);
        mockReadStream.push(null);
        e.send('someMethod', reqMessage);
        const response = (await (0, events_1.once)(e, 'error'))[0];
        (0, vitest_1.expect)(response).toContain('Got 10, expected 0');
    });
});
//# sourceMappingURL=jsonRpcEndpoint.test.js.map