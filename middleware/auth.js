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
exports.pinAuth = void 0;
const User_model_1 = __importDefault(require("@model/User.model"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = require("passport-local");
const initPassport = (app) => {
    app.use(passport_1.default.initialize());
    passport_1.default.use('signup', new passport_local_1.Strategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
    }, (req, username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = req.body;
        if (!email || !username || !password)
            return done(null, false, { message: 'Missing Credentials' });
        const exists = yield User_model_1.default.findOne({ $or: [{ username }, { email }] });
        if (exists)
            return done(null, false, { message: 'User already exists' });
        const newUser = new User_model_1.default({ username, email, password });
        yield newUser.save();
        return done(null, newUser.id, { message: 'User created' });
    })));
    passport_1.default.use('signin', new passport_local_1.Strategy({
        usernameField: 'identity',
        passwordField: 'password',
    }, (identity, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        const regex = new RegExp(`^${identity}$`, 'i');
        const user = yield User_model_1.default.findOne({
            $or: [{ email: regex }, { username: regex }],
        }).select('+password');
        if (!(user === null || user === void 0 ? void 0 : user.hasPassword))
            return done(null, false, { message: 'Account Created using Socials' });
        if (!user)
            return done(null, false, { message: 'User not found' });
        const isValid = yield user.isValidPassword(password);
        if (!isValid)
            return done(null, false, { message: 'Invalid password' });
        return done(null, user.id, { message: 'User signed in' });
    })));
    passport_1.default.use(new passport_jwt_1.Strategy({
        jwtFromRequest: (req) => req.cookies.token,
        secretOrKey: process.env.JWT_SECRET,
    }, (token, done) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_model_1.default.findById(token.userId);
        if (!user)
            return done(null, false, { message: 'User not found' });
        return done(null, user);
    })));
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    }, (accessToken, refreshToken, profile, cb) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        console.log(accessToken, refreshToken, profile);
        if (!profile.id)
            return cb(new Error('Google Sign-In Failed'));
        const user = yield User_model_1.default.findOne({ googleId: profile.id });
        if (!user && profile.emails && profile.emails[0].value) {
            const { name, picture, email, sub: googleId, locale } = profile._json;
            const newUser = yield User_model_1.default.create({
                email,
                name,
                googleId,
                picture,
                username: (_a = email === null || email === void 0 ? void 0 : email.split('@')) === null || _a === void 0 ? void 0 : _a[0],
                locale,
            });
            yield newUser.save();
            console.log(newUser);
            return cb(null, newUser);
        }
        return cb(null, user);
    })));
};
const pinAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (!((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.pinAuth))
        return res
            .status(401)
            .json({ error: 'PIN Unauthenticated', code: 'pin-auth-failed' });
    const user = yield User_model_1.default.findById((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id).select('+sessionId');
    console.log('Decrypting: ', (_c = req === null || req === void 0 ? void 0 : req.headers) === null || _c === void 0 ? void 0 : _c.pinAuth, user === null || user === void 0 ? void 0 : user.sessionId);
    const pin = crypto_js_1.default.AES.decrypt((_d = req === null || req === void 0 ? void 0 : req.headers) === null || _d === void 0 ? void 0 : _d.pinAuth, user === null || user === void 0 ? void 0 : user.sessionId).toString(crypto_js_1.default.enc.Utf8);
    if (user === null || user === void 0 ? void 0 : user.isValidPin(pin))
        next();
    else {
        res.statusMessage = 'pin-auth-failed';
        return res
            .status(401)
            .json({ error: 'PIN Unauthenticated', code: 'pin-auth-failed' });
    }
});
exports.pinAuth = pinAuth;
exports.default = initPassport;
