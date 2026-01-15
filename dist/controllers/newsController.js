"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePreferences = exports.getNews = void 0;
const newsService_1 = require("../services/newsService");
const User_1 = __importDefault(require("../model/User"));
/**
 * Get Personalized News.
 *
 * Query Params:
 * - page: integer (pagination)
 * - q: string (search query)
 */
const getNews = async (req, res, next) => {
    try {
        if (!req.user)
            throw new Error('User not authenticated');
        const page = parseInt(req.query.page) || 1;
        const query = req.query.q;
        const userPreferences = {
            categories: req.user.preferences.categories
        };
        const newsData = await (0, newsService_1.fetchNews)(userPreferences, page, query);
        res.status(200).json({
            news: newsData.articles
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getNews = getNews;
/**
 * Update User Preferences.
 *
 * Body:
 * - categories: string[] (e.g. ['sports', 'health'])
 */
const updatePreferences = async (req, res, next) => {
    try {
        if (!req.user)
            throw new Error('User not found');
        const { categories } = req.body;
        const updatedUser = await User_1.default.findByIdAndUpdate(req.user._id, {
            $set: {
                'preferences.categories': categories || ['general']
            }
        }, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            data: updatedUser?.preferences
        });
    }
    catch (err) {
        next(err);
    }
};
exports.updatePreferences = updatePreferences;
