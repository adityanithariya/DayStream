"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("@controller/auth.controller");
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const validation_1 = require("@middleware/validation");
const User_model_1 = __importDefault(require("@model/User.model"));
const signJWT_1 = __importDefault(require("@utils/signJWT"));
const authRouter = (0, express_1.Router)();
authRouter.post('/signup', auth_controller_1.signUp);
authRouter.post('/signin', auth_controller_1.signIn);
authRouter.post('/signout', auth_controller_1.signOut);
authRouter.get('/google', passport_1.default.authenticate('google', { scope: ['email', 'profile'] }));
authRouter.get('/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_BASE_URL}/login?error=google-auth-failed`,
    session: false,
}), (req, res) => {
    res.redirect(`${process.env.CLIENT_BASE_URL}/login/${(0, signJWT_1.default)(req.user)}`);
});
authRouter.post('/google/success', (req, res) => {
    res.cookie('token', req.body.token);
    res.status(200).json({ message: 'Google Sign-In Success', success: true });
});
authRouter.get('/username', (0, validation_1.validateHasParameters)('username'), (req, res) => {
    var _a;
    const user = User_model_1.default.findOne({ username: (_a = req.body) === null || _a === void 0 ? void 0 : _a.username });
    if (!user)
        res.status(200).json({ available: true });
    else
        res.status(200).json({ available: false });
});
exports.default = authRouter;
