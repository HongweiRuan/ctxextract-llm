"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const prelude_1 = require("./prelude");
const update = (model, action) => {
    const [grid, selectedEmoji, emojiList] = model;
    switch (action.type) {
        case "SelectEmoji":
            return [grid, action.emoji, emojiList];
        case "StampEmoji":
            return [(0, prelude_1.updateGrid)(grid, action.row, action.col, selectedEmoji), selectedEmoji, emojiList];
        case "ClearCell":
            return [(0, prelude_1.updateGrid)(grid, action.row, action.col, ""), selectedEmoji, emojiList];
        case "ClearGrid":
            return [(0, prelude_1.clearGrid)(grid), selectedEmoji, emojiList];
        case "FillRow":
            return [(0, prelude_1.fillRowInGrid)(grid, action.row, selectedEmoji), selectedEmoji, emojiList];
    }
};
exports.update = update;
//# sourceMappingURL=solution.js.map