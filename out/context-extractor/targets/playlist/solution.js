"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const prelude_1 = require("./prelude");
// Playlist MVU SOLUTION
// Update playlist based on action
const update = (playlist, action) => {
    switch (action.type) {
        case "PlaySong":
            return [(0, prelude_1.get_songs)(playlist), { type: "Playing", id: action.id }];
        case "PauseCurrentSong":
            const state = (0, prelude_1.get_state)(playlist);
            switch (state.type) {
                case "Playing":
                    return [(0, prelude_1.get_songs)(playlist), { type: "PausedOn", id: state.id }];
                default:
                    return [(0, prelude_1.get_songs)(playlist), state];
            }
        case "RemoveSong":
            const new_songs = (0, prelude_1.get_songs)(playlist).filter((id) => id !== action.id);
            const new_state = (() => {
                const state = (0, prelude_1.get_state)(playlist);
                switch (state.type) {
                    case "Playing":
                        return action.id === state.id ? { type: "NoSongSelected" } : state;
                    case "PausedOn":
                        return action.id === state.id ? { type: "NoSongSelected" } : state;
                    case "NoSongSelected":
                        return { type: "NoSongSelected" };
                }
            })();
            return [new_songs, new_state];
        case "AddSong":
            return [[...(0, prelude_1.get_songs)(playlist), action.id], (0, prelude_1.get_state)(playlist)];
    }
};
exports.update = update;
//# sourceMappingURL=solution.js.map