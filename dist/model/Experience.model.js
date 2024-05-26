"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const experienceSchema = new mongoose_1.Schema({
    journal: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Journal',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    at: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
const Experience = (0, mongoose_1.model)('Experience', experienceSchema);
exports.default = Experience;
