"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, "Username is required."],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email",
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        minLength: 6,
        select: false,
    },
    preferences: {
        categories: {
            type: [String],
            default: ["general"],
        },
    },
}, {
    timestamps: true,
});
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcryptjs_1.default.compare(candidatePassword, this.password);
};
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
