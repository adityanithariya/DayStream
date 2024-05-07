"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    daily: {
        type: Boolean,
        required: true,
        default: false,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    completed: [
        {
            type: Date,
            default: false,
        },
    ],
}, { timestamps: true });
const Task = (0, mongoose_1.model)('Task', taskSchema);
exports.default = Task;
