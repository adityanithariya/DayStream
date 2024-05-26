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
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    name: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        select: false,
    },
    pin: {
        type: String,
        select: false,
        minlength: 4,
        maxlength: 6,
    },
    googleId: {
        type: String,
        select: false,
    },
    picture: {
        type: String,
    },
    locale: {
        type: String,
    },
    sessionId: {
        type: String,
        select: false,
    },
}, { timestamps: true });
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password') && this.password)
            this.password = yield (0, bcrypt_1.hash)(this.password, yield (0, bcrypt_1.genSalt)(10));
        if (this.isModified('pin') && this.pin)
            this.pin = yield (0, bcrypt_1.hash)(this.pin, yield (0, bcrypt_1.genSalt)(10));
        next();
    });
});
userSchema.methods.isValidPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.password)
            return false;
        return yield (0, bcrypt_1.compare)(password, this.password);
    });
};
userSchema.methods.isValidPin = function (pin) {
    return __awaiter(this, void 0, void 0, function* () {
        const { pin: originalPin, hasPIN } = (yield User.findById(this.id).select('+pin'));
        if (!hasPIN)
            return false;
        return yield (0, bcrypt_1.compare)(pin, originalPin);
    });
};
userSchema.methods.generateSessionID = function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.sessionId = yield (0, bcrypt_1.hash)(this.id + Date.now().toString(), yield (0, bcrypt_1.genSalt)(10));
        this.save();
        return this.sessionId;
    });
};
userSchema.virtual('hasPassword').get(function () {
    return this.password !== undefined;
});
userSchema.virtual('hasPIN').get(function () {
    return this.pin !== undefined;
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
