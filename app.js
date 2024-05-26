"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv_1 = require("dotenv");
require("module-alias/register");
(0, dotenv_1.config)();
const auth_controller_1 = require("@controller/auth.controller");
const auth_1 = __importStar(require("@middleware/auth"));
require("@middleware/config");
const auth_routes_1 = __importDefault(require("@routes/auth.routes"));
const user_routes_1 = __importDefault(require("@routes/user.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const passport_1 = __importDefault(require("passport"));
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 5000;
(0, auth_1.default)(app);
const allowedOrigins = [
    'http://localhost:3000',
    process.env.CLIENT_BASE_URL,
];
app.use((0, cors_1.default)({ origin: allowedOrigins, credentials: true }));
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/auth', auth_routes_1.default);
app.get('/', (_req, res) => {
    res.send('OK').status(200);
});
app.use(passport_1.default.authenticate('jwt', { session: false }));
app.use('/u', user_routes_1.default);
app.use(auth_1.pinAuth);
app.get('/auth/protect', auth_controller_1.checkAuth);
console.log('Connecting to MongoDB...');
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoose_1.connect)(process.env.MONGO_URI);
    console.log(`Server listening on http://localhost:${port}`);
}));
