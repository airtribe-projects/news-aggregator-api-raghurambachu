import express from 'express';
import { register, login } from '../controllers/authController';
import { registerValidation } from '../middleware/validator';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', login);

export default router;