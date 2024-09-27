"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prelude_1 = require("./prelude");
const sketch_1 = require("./sketch");
// ROOM BOOKING MVU EPILOGUE
const test1 = () => {
    const model = (0, sketch_1.update)(prelude_1.Model_init, { type: "AddBooking", user: "Charles", weekday: "M", timeOfDay: "AM" });
    return {
        result: (0, prelude_1.getBookings)(model)[0][0][0] === "M" && (0, prelude_1.getBookings)(model)[0][0][1] === "AM" && (0, prelude_1.getBookings)(model)[0][1] === "Charles" && (0, prelude_1.getBookings)(model)[0][2] === 0,
        values: [(0, prelude_1.getBookings)(model)[0], [["M", "AM"], "Charles", 0]],
    };
};
const test2 = () => {
    const model = (0, sketch_1.update)(prelude_1.Model_init, { type: "AddBooking", user: "Alice", weekday: "T", timeOfDay: "PM" });
    return {
        result: (0, prelude_1.getBookings)(model)[0][0][0] === "T" && (0, prelude_1.getBookings)(model)[0][0][1] === "PM" && (0, prelude_1.getBookings)(model)[0][1] === "Alice" && (0, prelude_1.getBookings)(model)[0][2] === 0,
        values: [(0, prelude_1.getBookings)(model)[0], [["T", "PM"], "Alice", 0]],
    };
};
const test3 = () => {
    const model = (0, sketch_1.update)(prelude_1.Model_init, { type: "AddBooking", user: "Bob", weekday: "W", timeOfDay: "AM" });
    return {
        result: (0, prelude_1.getUserBookings)(model, "Bob")[0][0][0] === "W" && (0, prelude_1.getUserBookings)(model, "Bob")[0][0][1] === "AM" && (0, prelude_1.getUserBookings)(model, "Bob")[0][1] === "Bob" && (0, prelude_1.getUserBookings)(model, "Bob")[0][2] === 0,
        values: [(0, prelude_1.getUserBookings)(model, "Bob")[0], [["W", "AM"], "Bob", 0]],
    };
};
const test4 = () => {
    let model = (0, sketch_1.update)(prelude_1.Model_init, { type: "AddBooking", user: "Alice", weekday: "R", timeOfDay: "PM" });
    model = (0, sketch_1.update)(model, { type: "CancelBooking", user: "Alice", id: 0 });
    return {
        result: (0, prelude_1.getUserBookings)(model, "Alice").length === 0,
        values: [(0, prelude_1.getUserBookings)(model, "Alice").length, 0],
    };
};
const test5 = () => {
    let model = (0, sketch_1.update)(prelude_1.Model_init, { type: "AddBooking", user: "Alice", weekday: "F", timeOfDay: "AM" });
    model = (0, sketch_1.update)(model, { type: "AddBooking", user: "Bob", weekday: "F", timeOfDay: "AM" });
    const booking = (0, prelude_1.getBookingById)(model, 1);
    return {
        result: booking !== undefined && booking[0][0] === "F" && booking[0][1] === "AM" && booking[1] === "Bob" && booking[2] === 1,
        values: [booking, [["F", "AM"], "Bob", 1]],
    };
};
const test6 = () => {
    let model = (0, sketch_1.update)(prelude_1.Model_init, { type: "AddBooking", user: "Alice", weekday: "M", timeOfDay: "AM" });
    model = (0, sketch_1.update)(model, { type: "AddBooking", user: "Bob", weekday: "M", timeOfDay: "PM" });
    model = (0, sketch_1.update)(model, { type: "AddBooking", user: "Alice", weekday: "T", timeOfDay: "AM" });
    model = (0, sketch_1.update)(model, { type: "AddBooking", user: "Bob", weekday: "T", timeOfDay: "PM" });
    model = (0, sketch_1.update)(model, { type: "AddBooking", user: "Alice", weekday: "W", timeOfDay: "AM" });
    model = (0, sketch_1.update)(model, { type: "CancelBooking", user: "Alice", id: 0 });
    model = (0, sketch_1.update)(model, { type: "CancelBooking", user: "Bob", id: 3 });
    return {
        result: (0, prelude_1.getBookings)(model).length === 3 &&
            (0, prelude_1.getBookings)(model)[0][0][0] === "M" && (0, prelude_1.getBookings)(model)[0][0][1] === "PM" && (0, prelude_1.getBookings)(model)[0][1] === "Bob" && (0, prelude_1.getBookings)(model)[0][2] === 1 &&
            (0, prelude_1.getBookings)(model)[1][0][0] === "T" && (0, prelude_1.getBookings)(model)[1][0][1] === "AM" && (0, prelude_1.getBookings)(model)[1][1] === "Alice" && (0, prelude_1.getBookings)(model)[1][2] === 2 &&
            (0, prelude_1.getBookings)(model)[2][0][0] === "W" && (0, prelude_1.getBookings)(model)[2][0][1] === "AM" && (0, prelude_1.getBookings)(model)[2][1] === "Alice" && (0, prelude_1.getBookings)(model)[2][2] === 4,
        values: [(0, prelude_1.getBookings)(model), [
                [["M", "PM"], "Bob", 1],
                [["T", "AM"], "Alice", 2],
                [["W", "AM"], "Alice", 4],
            ]],
    };
};
const test7 = () => {
    let model = (0, sketch_1.update)(prelude_1.Model_init, { type: "AddBooking", user: "Alice", weekday: "M", timeOfDay: "AM" });
    model = (0, sketch_1.update)(model, { type: "AddBooking", user: "Bob", weekday: "M", timeOfDay: "AM" });
    model = (0, sketch_1.update)(model, { type: "AddBooking", user: "Charlie", weekday: "M", timeOfDay: "AM" });
    model = (0, sketch_1.update)(model, { type: "AddBooking", user: "Dave", weekday: "M", timeOfDay: "PM" });
    model = (0, sketch_1.update)(model, { type: "AddBooking", user: "Eve", weekday: "M", timeOfDay: "PM" });
    model = (0, sketch_1.update)(model, { type: "CancelBooking", user: "Bob", id: 1 });
    model = (0, sketch_1.update)(model, { type: "CancelBooking", user: "Dave", id: 3 });
    model = (0, sketch_1.update)(model, { type: "CancelBooking", user: "Alice", id: 0 });
    return {
        result: (0, prelude_1.getBookings)(model).length === 2 &&
            (0, prelude_1.getBookings)(model)[0][0][0] === "M" && (0, prelude_1.getBookings)(model)[0][0][1] === "AM" && (0, prelude_1.getBookings)(model)[0][1] === "Charlie" && (0, prelude_1.getBookings)(model)[0][2] === 2 &&
            (0, prelude_1.getBookings)(model)[1][0][0] === "M" && (0, prelude_1.getBookings)(model)[1][0][1] === "PM" && (0, prelude_1.getBookings)(model)[1][1] === "Eve" && (0, prelude_1.getBookings)(model)[1][2] === 4,
        values: [(0, prelude_1.getBookings)(model), [
                [["M", "AM"], "Charlie", 2],
                [["M", "PM"], "Eve", 4],
            ]],
    };
};
const test8 = () => {
    let model = (0, sketch_1.update)(prelude_1.Model_init, { type: "AddBooking", user: "Alice", weekday: "M", timeOfDay: "AM" });
    model = (0, sketch_1.update)(model, { type: "ClearBookings" });
    return {
        result: (0, prelude_1.getBookings)(model).length === 0,
        values: [(0, prelude_1.getBookings)(model).length, 0],
    };
};
const tests = [test1, test2, test3, test4, test5, test6, test7, test8];
let score = 0;
for (let i = 0; i < tests.length; ++i) {
    try {
        const run = tests[i]();
        console.assert(run.result === true, "%o", { i: i + 1, values: run.values });
        if (run.result) {
            score++;
        }
    }
    catch (err) {
        console.log(err);
    }
}
console.log(`score: ${score} / ${tests.length}`);
//# sourceMappingURL=epilogue.js.map