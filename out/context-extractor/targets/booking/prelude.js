"use strict";
// ROOM BOOKING MVU
Object.defineProperty(exports, "__esModule", { value: true });
exports.rm_booking = exports.getBookingById = exports.getUserBookings = exports.bookingExists = exports.getBookings = exports.Model_init = exports.initFormState = void 0;
const initFormState = [["M", "AM"], ""];
exports.initFormState = initFormState;
const Model_init = [initFormState, [], 0];
exports.Model_init = Model_init;
const getBookings = (model) => {
    const [, bs,] = model;
    return bs;
};
exports.getBookings = getBookings;
const bookingExists = (model, booking) => {
    return getBookings(model).some((b) => b[0] === booking[0] && b[1] === booking[1] && b[2] === booking[2]);
};
exports.bookingExists = bookingExists;
const getUserBookings = (model, user) => {
    return getBookings(model).filter(([, u,]) => u === user);
};
exports.getUserBookings = getUserBookings;
const getBookingById = (model, id) => {
    const bookings = getBookings(model).filter(([, , i]) => i === id);
    return bookings.length > 0 ? bookings[0] : undefined;
};
exports.getBookingById = getBookingById;
const rm_booking = (user, id, bookings) => {
    return bookings.filter(([, u, i]) => (u !== user) || (i !== id));
};
exports.rm_booking = rm_booking;
//# sourceMappingURL=prelude.js.map