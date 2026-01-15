import express from "express";
import { getNews, updatePreferences } from "../controllers/newsController";

import { prefsValidation } from "../middleware/validator";
import { AuthRequest, protect } from "../middleware/auth";

const router = express.Router();

// All routes require authentication
router.use((req, res, next) => protect(req as AuthRequest, res, next));

// GET /api/news?page=1&q=keyword
router.get("/", getNews);

// PUT /api/news/preferences
router.put("/preferences", prefsValidation, updatePreferences);

export default router;
