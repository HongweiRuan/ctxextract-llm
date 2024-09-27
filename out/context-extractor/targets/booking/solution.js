"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const prelude_1 = require("./prelude");
const update = (model, action) => {
    const [formState, bookings, nextId] = model;
    switch (action.type) {
        case "AddBooking":
            const newBooking = [[action.weekday, action.timeOfDay], action.user, nextId];
            return [[[action.weekday, action.timeOfDay], action.user], [...bookings, newBooking], nextId + 1];
        case "CancelBooking":
            // const updatedBookings = bookings.filter(([_, u, i]) => u !== action.user || i !== action.id);
            // return [formState, updatedBookings, nextId];
            return [formState, (0, prelude_1.rm_booking)(action.user, action.id, bookings), nextId];
        case "ClearBookings":
            return [formState, [], nextId];
    }
};
exports.update = update;
//# sourceMappingURL=solution.js.map