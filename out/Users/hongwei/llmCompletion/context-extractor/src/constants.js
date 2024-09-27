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
exports.EMOJIPAINT_DIR = exports.BOOKING_DIR = exports.PASSWORDS_DIR = exports.PLAYLIST_DIR = exports.TODO_DIR = exports.TARGET_DIR = exports.QUERY_DIR = exports.DEPS_DIR = exports.ROOT_DIR = exports.CODEQL_PATH = void 0;
// import * as path from "path";
// import * as process from "process";
//
//
// const ROOT_DIR = process.cwd();
// const CODEQL_PATH = path.join(ROOT_DIR, "codeql", "codeql");
// const QUERY_DIR = path.join("/", "home", "jacob", "projects", "context-extractor", "queries", "codeql-custom-queries-javascript");
// const TARGET_DIR = path.join("/", "home", "jacob", "projects", "context-extractor", "targets");
// const TODO_DIR = path.join("/", "home", "jacob", "projects", "context-extractor", "targets", "todo");
// const PLAYLIST_DIR = path.join("/", "home", "jacob", "projects", "context-extractor", "targets", "playlist");
// const PASSWORDS_DIR = path.join("/", "home", "jacob", "projects", "context-extractor", "targets", "passwords");
// const BOOKING_DIR = path.join("/", "home", "jacob", "projects", "context-extractor", "targets", "booking");
// const EMOJIPAINT_DIR = path.join("/", "home", "jacob", "projects", "context-extractor", "targets", "emojipaint");
//
// export { CODEQL_PATH, ROOT_DIR, QUERY_DIR, TARGET_DIR, TODO_DIR, PLAYLIST_DIR, PASSWORDS_DIR, BOOKING_DIR, EMOJIPAINT_DIR };
const path = __importStar(require("path"));
const ROOT_DIR = path.join("/", "app");
exports.ROOT_DIR = ROOT_DIR;
const DEPS_DIR = path.join(ROOT_DIR, "deps");
exports.DEPS_DIR = DEPS_DIR;
const CODEQL_PATH = path.join(DEPS_DIR, "codeql", "codeql");
exports.CODEQL_PATH = CODEQL_PATH;
const QUERY_DIR = path.join(DEPS_DIR, "queries", "codeql-custom-queries-javascript");
exports.QUERY_DIR = QUERY_DIR;
const TARGET_DIR = path.join(DEPS_DIR, "targets");
exports.TARGET_DIR = TARGET_DIR;
const TODO_DIR = path.join(DEPS_DIR, "targets", "todo");
exports.TODO_DIR = TODO_DIR;
const PLAYLIST_DIR = path.join(DEPS_DIR, "targets", "playlist");
exports.PLAYLIST_DIR = PLAYLIST_DIR;
const PASSWORDS_DIR = path.join(DEPS_DIR, "targets", "passwords");
exports.PASSWORDS_DIR = PASSWORDS_DIR;
const BOOKING_DIR = path.join(DEPS_DIR, "targets", "booking");
exports.BOOKING_DIR = BOOKING_DIR;
const EMOJIPAINT_DIR = path.join(DEPS_DIR, "targets", "emojipaint");
exports.EMOJIPAINT_DIR = EMOJIPAINT_DIR;
//# sourceMappingURL=constants.js.map