import { body, validationResult } from "express-validator";
import { Response, Request, NextFunction } from "express";

export const handleValidationErrors = (req: any, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  handleValidationErrors
];

export const prefsValidation = [
  body('categories').optional().isArray().withMessage('Categories must be an array'),
  handleValidationErrors
];