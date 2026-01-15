"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// GET /users/preferences - Get user preferences
router.get('/preferences', (req, res, next) => (0, auth_1.protect)(req, res, next), authController_1.getPreferences);
// PUT /users/preferences - Update user preferences
router.put('/preferences', (req, res, next) => (0, auth_1.protect)(req, res, next), authController_1.updatePreferences);
exports.default = router;
