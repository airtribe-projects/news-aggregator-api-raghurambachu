import express from 'express';
import { getPreferences, updatePreferences } from '../controllers/authController';
import { protect, AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET /users/preferences - Get user preferences
router.get('/preferences', (req, res, next) => protect(req as AuthRequest, res, next), getPreferences);

// PUT /users/preferences - Update user preferences
router.put('/preferences', (req, res, next) => protect(req as AuthRequest, res, next), updatePreferences);

export default router;
