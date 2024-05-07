"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tagEntrySchema = new mongoose_1.Schema({
    tag: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Tag',
        required: true,
    },
    value: {
        type: Number,
        required: true,
        trim: true,
    },
    note: {
        type: String,
        required: false,
    },
}, { timestamps: true });
const TagEntry = (0, mongoose_1.model)('TagEntry', tagEntrySchema);
exports.default = TagEntry;
