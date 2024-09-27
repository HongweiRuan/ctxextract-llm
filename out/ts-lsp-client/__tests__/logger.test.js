"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../src/logger");
const vitest_1 = require("vitest");
(0, vitest_1.describe)('ts-lsp-client logger', () => {
    let stdoutWriteSpy;
    (0, vitest_1.beforeEach)(() => {
        stdoutWriteSpy = vitest_1.vi.spyOn(process.stdout, 'write');
    });
    (0, vitest_1.afterEach)(() => {
        stdoutWriteSpy.mockClear();
    });
    (0, vitest_1.it)('prints logs', async () => {
        logger_1.Logger.setLogLevel('trace', false);
        logger_1.Logger.log('Test Trace Message', logger_1.LoggerLevel.TRACE);
        logger_1.Logger.log('Test Debug Message', logger_1.LoggerLevel.DEBUG);
        logger_1.Logger.log('Test Info Message', logger_1.LoggerLevel.INFO);
        logger_1.Logger.log('Test Warn Message', logger_1.LoggerLevel.WARN);
        logger_1.Logger.log('Test Error Message', logger_1.LoggerLevel.ERROR);
        logger_1.Logger.log('Test Fatal Message', logger_1.LoggerLevel.FATAL);
        const output = stdoutWriteSpy.mock.calls.reduce((acc, c) => { acc += c[0]; return acc; }, '');
        (0, vitest_1.expect)(output).toContain('Test Trace Message');
        (0, vitest_1.expect)(output).toContain('Test Debug Message');
        (0, vitest_1.expect)(output).toContain('Test Info Message');
        (0, vitest_1.expect)(output).toContain('Test Warn Message');
        (0, vitest_1.expect)(output).toContain('Test Error Message');
        (0, vitest_1.expect)(output).toContain('Test Fatal Message');
    });
    (0, vitest_1.it)('doesn\'t print logs below the level specified during initialization', async () => {
        logger_1.Logger.setLogLevel('warn', false);
        logger_1.Logger.log('Test Trace Message', logger_1.LoggerLevel.TRACE);
        logger_1.Logger.log('Test Debug Message', logger_1.LoggerLevel.DEBUG);
        logger_1.Logger.log('Test Info Message', logger_1.LoggerLevel.INFO);
        logger_1.Logger.log('Test Warn Message', logger_1.LoggerLevel.WARN);
        logger_1.Logger.log('Test Error Message', logger_1.LoggerLevel.ERROR);
        logger_1.Logger.log('Test Fatal Message', logger_1.LoggerLevel.FATAL);
        const output = stdoutWriteSpy.mock.calls.reduce((acc, c) => { acc += c[0]; return acc; }, '');
        (0, vitest_1.expect)(output).not.toContain('Test Trace Message');
        (0, vitest_1.expect)(output).not.toContain('Test Debug Message');
        (0, vitest_1.expect)(output).not.toContain('Test Info Message');
        (0, vitest_1.expect)(output).toContain('Test Warn Message');
        (0, vitest_1.expect)(output).toContain('Test Error Message');
        (0, vitest_1.expect)(output).toContain('Test Fatal Message');
    });
    (0, vitest_1.it)('doesn\'t print when json output is requested', async () => {
        logger_1.Logger.setLogLevel('warn', true);
        logger_1.Logger.log('Test Trace Message', logger_1.LoggerLevel.TRACE);
        logger_1.Logger.log('Test Debug Message', logger_1.LoggerLevel.DEBUG);
        logger_1.Logger.log('Test Info Message', logger_1.LoggerLevel.INFO);
        logger_1.Logger.log('Test Warn Message', logger_1.LoggerLevel.WARN);
        logger_1.Logger.log('Test Error Message', logger_1.LoggerLevel.ERROR);
        logger_1.Logger.log('Test Fatal Message', logger_1.LoggerLevel.FATAL);
        const output = stdoutWriteSpy.mock.calls.reduce((acc, c) => { acc += c[0]; return acc; }, '');
        (0, vitest_1.expect)(output).not.toContain('Test Trace Message');
        (0, vitest_1.expect)(output).not.toContain('Test Debug Message');
        (0, vitest_1.expect)(output).not.toContain('Test Info Message');
        (0, vitest_1.expect)(output).not.toContain('Test Warn Message');
        (0, vitest_1.expect)(output).not.toContain('Test Error Message');
        (0, vitest_1.expect)(output).not.toContain('Test Fatal Message');
    });
});
//# sourceMappingURL=logger.test.js.map