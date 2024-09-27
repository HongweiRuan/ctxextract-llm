"use strict";
// EMOJIPAINT MVU
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillRowInGrid = exports.clearGrid = exports.updateGrid = exports.model_init = void 0;
const model_init = [
    [["", "", ""], ["", "", ""], ["", "", ""]], // Initial 3x3 empty grid
    "😄", // Initial selected emoji
    ["😄", "😅", "😆", "😉", "😊"] // Available emojis
];
exports.model_init = model_init;
const updateGrid = (grid, row, col, emoji) => {
    return grid.map((r, i) => {
        if (i === row) {
            return r.map((c, j) => j === col ? emoji : c);
        }
        else {
            return r;
        }
    });
};
exports.updateGrid = updateGrid;
const clearGrid = (grid) => {
    return grid.map(row => row.map(_ => ""));
};
exports.clearGrid = clearGrid;
const fillRowInGrid = (grid, rowToFill, emoji) => {
    return grid.map((row, i) => {
        if (i === rowToFill) {
            return row.map(_ => emoji);
        }
        else {
            return row;
        }
    });
};
exports.fillRowInGrid = fillRowInGrid;
//# sourceMappingURL=prelude.js.map