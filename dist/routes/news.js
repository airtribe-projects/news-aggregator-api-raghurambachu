"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const newsController_1 = require("../controllers/newsController");
const validator_1 = require("../middleware/validator");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use((req, res, next) => (0, auth_1.protect)(req, res, next));
// GET /api/news?page=1&q=keyword
router.get("/", newsController_1.getNews);
// PUT /api/news/preferences
router.put("/preferences", validator_1.prefsValidation, newsController_1.updatePreferences);
exports.default = router;
