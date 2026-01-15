import express, { Application } from "express";
import dotenv from "dotenv";
// Load Env BEFORE importing routes to ensure env vars are available
dotenv.config({ path: "./.env" });

import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
const connectDB = require("./config/db");

// Routes
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import newsRoutes from "./routes/news";

// Middleware
import { errorHandler } from "./middleware/errorHandler";

// Connect Database
connectDB();

const app: Application = express();

// 1. Body Parser
app.use(express.json());

// 2. CORS
app.use(cors());

// 3. Logger (Dev only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 4. Rate Limiter (Security)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// 5. Mount Routers
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/news", newsRoutes);

// 6. Error Handler (Must be last)
app.use(errorHandler);

export default app;
