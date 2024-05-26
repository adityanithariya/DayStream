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
const mongoose_1 = require("mongoose");
const envKeys = ['MONGO_URI', 'JWT_SECRET', 'COOKIE_SECRET'];
for (const key of envKeys) {
    if (!process.env[key]) {
        throw new Error(`KeyError: ${key} is missing in .env`);
    }
}
mongoose_1.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
mongoose_1.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});
process.on('SIGINT' || 'SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Disconnecting from MongoDB...');
    yield mongoose_1.connection.close();
    process.exit(0);
}));
