"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tagSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    scale: {
        start: {
            type: Number,
            required: true,
            min: 1,
        },
        end: {
            type: Number,
            required: true,
            min: 1,
        },
    },
}, { timestamps: true });
const Tag = (0, mongoose_1.model)('Tag', tagSchema);
exports.default = Tag;
