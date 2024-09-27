"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_state = exports.get_songs = void 0;
// Get all the song ids in the playList
const get_songs = (playlist) => {
    const [songs, _] = playlist;
    return songs;
};
exports.get_songs = get_songs;
// Get the id of the currently playing song
const get_state = (playlist) => {
    const [_, state] = playlist;
    return state;
};
exports.get_state = get_state;
//# sourceMappingURL=prelude.js.map