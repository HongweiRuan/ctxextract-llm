"use strict";
// TODO MVU
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggle = exports.remove = exports.add = exports.Model_init = exports.model_eq = void 0;
const todo_eq = ([d1, s1], [d2, s2]) => {
    return d1 === d2 && s1 === s2;
};
const todo_array_eq = (ta1, ta2) => {
    return ta1.length === ta2.length && ta1.every((el, i) => { return todo_eq(el, ta2[i]); });
};
const model_eq = ([b1, ts1], [b2, ts2]) => {
    return b1 === b2 && todo_array_eq(ts1, ts2);
};
exports.model_eq = model_eq;
const Model_init = ["", []];
exports.Model_init = Model_init;
const add = (m) => {
    if (m[0] === "") {
        return m[1];
    }
    else {
        return [...m[1], [m[0], false]];
    }
};
exports.add = add;
const remove = (index, todos) => {
    const removedTodos = [];
    for (let i = 0; i < todos.length; i++) {
        if (i !== index) {
            removedTodos.push(todos[i]);
        }
    }
    return removedTodos;
    // const removedTodos = todos.filter((_, i) => { i !== index });
    // return removedTodos;
};
exports.remove = remove;
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
exports.toggle = toggle;
//# sourceMappingURL=prelude.js.map