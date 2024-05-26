"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    failureRedirect: `${process.env.CLIENT_BASE_URL}/auth/google?error=google-auth-failed`,
    session: false,
}), (req, res) => {
    res.redirect(`${process.env.CLIENT_BASE_URL}/auth/google?token=${(0, signJWT_1.default)(req.user)}`);
});
authRouter.post('/google/success', (req, res) => {
    res.cookie('token', req.body.token);
    res.status(200).json({ message: 'Google Sign-In Success', success: true });
});
authRouter.get('/username', (0, validation_1.validateHasParameters)('username'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.query;
    const user = yield User_model_1.default.findOne({ username });
    if (!user)
        res.status(200).json({ available: true });
    else
        res.status(200).json({ available: false });
}));
exports.default = authRouter;
