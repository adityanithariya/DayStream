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
exports.checkAuth = exports.signOut = exports.signIn = exports.signUp = void 0;
const User_model_1 = __importDefault(require("@model/User.model"));
const signJWT_1 = __importDefault(require("@utils/signJWT"));
const passport_1 = __importDefault(require("passport"));
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('signup', { session: false }, (err, userId, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res
                .status(500)
                .json({ message: 'Internal Server Error', error: err.message });
        if (!userId)
            return res.status(400).json(info);
        res.status(201).json(Object.assign(Object.assign({}, info), { user: yield User_model_1.default.findById(userId), token: (0, signJWT_1.default)(userId) }));
    }))(req, res, next);
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('signin', { session: false }, (err, userId, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res
                .status(500)
                .json({ message: 'Internal Server Error', error: err.message });
        if (!userId)
            return res.status(400).json(info);
        res.status(200).json(Object.assign(Object.assign({}, info), { user: yield User_model_1.default.findById(userId), token: (0, signJWT_1.default)(userId) }));
    }))(req, res);
});
exports.signIn = signIn;
const signOut = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('token').status(200).json({ message: 'User signed out' });
});
exports.signOut = signOut;
const checkAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.user;
    res.status(200).json({ message: 'User Authenticated', username });
});
exports.checkAuth = checkAuth;
