"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="vitest" />
const config_js_1 = require("vitest/config.js");
exports.default = (0, config_js_1.defineConfig)({
    resolve: {},
    test: {
        coverage: {
            provider: "c8",
            reportsDirectory: "coverage",
            reporter: ["json", "lcov"]
        }
    }
});
//# sourceMappingURL=vite.config.js.map