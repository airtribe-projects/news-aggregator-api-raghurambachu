"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefsValidation = exports.registerValidation = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
exports.registerValidation = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
    exports.handleValidationErrors
];
exports.prefsValidation = [
    (0, express_validator_1.body)('categories').optional().isArray().withMessage('Categories must be an array'),
    exports.handleValidationErrors
];
