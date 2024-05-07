"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenConfig = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const signJWT = (userId) => (0, jsonwebtoken_1.sign)({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15d',
});
exports.tokenConfig = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: 'strict',
    secure: process.env.Node_ENV === 'production',
};
exports.default = signJWT;
