"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load Env BEFORE importing routes to ensure env vars are available
dotenv_1.default.config({ path: "./.env" });
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const connectDB = require("./config/db");
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const news_1 = __importDefault(require("./routes/news"));
// Middleware
const errorHandler_1 = require("./middleware/errorHandler");
// Connect Database
connectDB();
const app = (0, express_1.default)();
// 1. Body Parser
app.use(express_1.default.json());
// 2. CORS
app.use((0, cors_1.default)());
// 3. Logger (Dev only)
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// 4. Rate Limiter (Security)
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);
// 5. Mount Routers
app.use("/api/auth", auth_1.default);
app.use("/api/users", users_1.default);
app.use("/api/news", news_1.default);
// 6. Error Handler (Must be last)
app.use(errorHandler_1.errorHandler);
exports.default = app;
