"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHasParameters = void 0;
const validateHasParameters = (...args) => {
    return (req, res, next) => {
        const data = req.body;
        let valid = true;
        for (const arg of args) {
            if (data[arg] === undefined) {
                res.status(403).json({ error: `${arg} not specified` });
                valid = false;
                break;
            }
        }
        if (valid) {
            next();
        }
    };
};
exports.validateHasParameters = validateHasParameters;
