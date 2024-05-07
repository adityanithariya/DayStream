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
const validation_1 = require("@middleware/validation");
const express_1 = require("express");
const userRouter = (0, express_1.Router)();
userRouter.post('/pin/set', (0, validation_1.validateHasParameters)('pin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    user.pin = req.body.pin;
    yield user.save();
    res.status(200).json({ message: 'PIN set successfully' });
}));
userRouter.post('/pin/verify', (0, validation_1.validateHasParameters)('pin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const isValid = yield user.isValidPin(req.body.pin);
    if (!isValid)
        res.status(200).json({ valid: false });
    else
        res
            .status(200)
            .json({ valid: true, sessionId: yield user.generateSessionID() });
}));
exports.default = userRouter;
