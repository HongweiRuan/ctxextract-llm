"use strict";
// TODO MVU PRELUDE
Object.defineProperty(exports, "__esModule", { value: true });
const todo_eq = ([d1, s1], [d2, s2]) => {
    return d1 === d2 && s1 === s2;
};
const todo_array_eq = (ta1, ta2) => {
    return ta1.length === ta2.length && ta1.every((el, i) => { return todo_eq(el, ta2[i]); });
};
const model_eq = ([b1, ts1], [b2, ts2]) => {
    return b1 === b2 && todo_array_eq(ts1, ts2);
};
const Model_init = ["", []];
const add = (m) => {
    if (m[0] === "") {
        return m[1];
    }
    else {
        return [...m[1], [m[0], false]];
    }
};
const remove = (index, todos) => {
    const removedTodos = [];
    for (let i = 0; i < todos.length; i++) {
        if (i !== index) {
            removedTodos.push(todos[i]);
        }
    }
    return removedTodos;
};
const toggle = (index, todos) => {
    const toggledTodos = todos.map((t, i) => {
        if (i === index) {
            return [t[0], !t[1]];
        }
        else {
            return t;
        }
    });
    return toggledTodos;
};
// Get all the song ids in the playList
const get_songs = (playlist) => {
    const [songs, _] = playlist;
    return songs;
};
// Get the id of the currently playing song
const get_state = (playlist) => {
    const [_, state] = playlist;
    return state;
};
const initialModel = [
    "",
    [
        { type: "MinimumLength", length: 8 },
        { type: "RequireUppercase" },
        { type: "RequireLowercase" },
        { type: "RequireNumber" },
        { type: "RequireSpecialChar" },
    ],
    "Weak",
];
const meetsMinLength = (password, len) => {
    return password.length >= len;
};
const hasFromSet = (password, set) => {
    const loop = (s) => {
        if (s.length === 0) {
            return false;
        }
        else {
            const first = s[0];
            if (set.includes(first)) {
                return true;
            }
            else {
                return loop(s.slice(1));
            }
        }
    };
    return loop(password);
};
const hasUppercase = (password) => {
    return hasFromSet(password, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
};
const hasLowercase = (password) => {
    return hasFromSet(password, "abcdefghijklmnopqrstuvwxyz");
};
const hasNumber = (password) => {
    return hasFromSet(password, "0123456789");
};
const hasSpecialChar = (password) => {
    return hasFromSet(password, "!@#$%^&*()-_=+[]{}|;:,.<>?");
};
const meetsCriterion = (password, criterion) => {
    switch (criterion.type) {
        case "RequireUppercase":
            return hasUppercase(password);
        case "RequireLowercase":
            return hasLowercase(password);
        case "MinimumLength":
            return meetsMinLength(password, criterion.length);
        case "RequireNumber":
            return hasNumber(password);
        case "RequireSpecialChar":
            return hasSpecialChar(password);
    }
};
const metCriteria = (password, criteria) => {
    return criteria.filter((c) => meetsCriterion(password, c));
};
const strength_of = (num_criteria_met) => {
    switch (num_criteria_met) {
        case 0:
        case 1:
        case 2:
            return "Weak";
        case 3:
            return "Moderate";
        case 4:
        case 5:
            return "Strong";
        default:
            return "Strong";
    }
};
const calculateStrength = (password, criteria) => {
    return strength_of(metCriteria(password, criteria).length);
};
const initFormState = [["M", "AM"], ""];
const Model_init = [initFormState, [], 0];
const getBookings = (model) => {
    const [, bs,] = model;
    return bs;
};
const bookingExists = (model, booking) => {
    return getBookings(model).some((b) => b[0] === booking[0] && b[1] === booking[1] && b[2] === booking[2]);
};
const getUserBookings = (model, user) => {
    return getBookings(model).filter(([, u,]) => u === user);
};
const getBookingById = (model, id) => {
    const bookings = getBookings(model).filter(([, , i]) => i === id);
    return bookings.length > 0 ? bookings[0] : undefined;
};
const rm_booking = (user, id, bookings) => {
    return bookings.filter(([, u, i]) => (u !== user) || (i !== id));
};
const model_init = [
    [["", "", ""], ["", "", ""], ["", "", ""]], // Initial 3x3 empty grid
    "😄", // Initial selected emoji
    ["😄", "😅", "😆", "😉", "😊"] // Available emojis
];
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
const clearGrid = (grid) => {
    return grid.map(row => row.map(_ => ""));
};
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
//# sourceMappingURL=vector_prelude.js.map