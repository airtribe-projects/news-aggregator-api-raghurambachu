"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = exports.updatePreferences = exports.getPreferences = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../model/User"));
const bcrypt = require("bcryptjs");
const getPreferences = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }
        const user = await User_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({
            preferences: user.preferences.categories
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getPreferences = getPreferences;
const updatePreferences = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }
        const { preferences } = req.body;
        const updatedUser = await User_1.default.findByIdAndUpdate(req.user._id, {
            $set: {
                'preferences.categories': preferences || ['general']
            }
        }, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            preferences: updatedUser?.preferences.categories
        });
    }
    catch (err) {
        next(err);
    }
};
exports.updatePreferences = updatePreferences;
const register = async (req, res, next) => {
    try {
        const { name, email, password, preferences } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        }
        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create User
        const user = await User_1.default.create({
            username: name,
            email,
            password: hashedPassword,
            preferences: {
                categories: preferences || ['general']
            }
        });
        // Generate Token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
        res.status(200).json({ token });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Please provide email and password" });
        }
        // Find user and explicitly select password (as it is hidden)
        const user = (await User_1.default.findOne({ email }).select("+password"));
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }
        // Compare Password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }
        sendTokenResponse(user, 200, res);
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const sendTokenResponse = (user, statusCode, res) => {
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
        expiresIn: "1h",
    });
    res.status(statusCode).json({ token });
};
