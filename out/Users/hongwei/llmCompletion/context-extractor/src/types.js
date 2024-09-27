"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = exports.Language = void 0;
var Language;
(function (Language) {
    Language[Language["TypeScript"] = 0] = "TypeScript";
    Language[Language["OCaml"] = 1] = "OCaml";
})(Language || (exports.Language = Language = {}));
var Model;
(function (Model) {
    Model[Model["None"] = 0] = "None";
    Model["GPT4"] = "gpt4";
    Model["Starcoder2"] = "starcoder2";
})(Model || (exports.Model = Model = {}));
//# sourceMappingURL=types.js.map