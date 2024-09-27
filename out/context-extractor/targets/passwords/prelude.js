"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateStrength = exports.strength_of = exports.metCriteria = exports.meetsCriterion = exports.hasSpecialChar = exports.hasNumber = exports.hasLowercase = exports.hasUppercase = exports.hasFromSet = exports.meetsMinLength = exports.initialModel = void 0;
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
exports.initialModel = initialModel;
const meetsMinLength = (password, len) => {
    return password.length >= len;
};
exports.meetsMinLength = meetsMinLength;
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
exports.hasFromSet = hasFromSet;
const hasUppercase = (password) => {
    return hasFromSet(password, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
};
exports.hasUppercase = hasUppercase;
const hasLowercase = (password) => {
    return hasFromSet(password, "abcdefghijklmnopqrstuvwxyz");
};
exports.hasLowercase = hasLowercase;
const hasNumber = (password) => {
    return hasFromSet(password, "0123456789");
};
exports.hasNumber = hasNumber;
const hasSpecialChar = (password) => {
    return hasFromSet(password, "!@#$%^&*()-_=+[]{}|;:,.<>?");
};
exports.hasSpecialChar = hasSpecialChar;
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
exports.meetsCriterion = meetsCriterion;
const metCriteria = (password, criteria) => {
    return criteria.filter((c) => meetsCriterion(password, c)).map((_) => true);
};
exports.metCriteria = metCriteria;
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
exports.strength_of = strength_of;
const calculateStrength = (password, criteria) => {
    return strength_of(metCriteria(password, criteria).length);
};
exports.calculateStrength = calculateStrength;
//# sourceMappingURL=prelude.js.map