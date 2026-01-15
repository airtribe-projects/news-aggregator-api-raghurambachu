import { Response, NextFunction } from 'express';
import { AuthRequest } from './authController';
import { fetchNews } from '../services/newsService';
import User from '../model/User';


/**
 * Get Personalized News.
 * 
 * Query Params:
 * - page: integer (pagination)
 * - q: string (search query)
 */
export const getNews = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Error('User not authenticated');

    const page = parseInt(req.query.page as string) || 1;
    const query = req.query.q as string;

    const userPreferences = {
      categories: req.user.preferences.categories
    };

    const newsData = await fetchNews(userPreferences, page, query);

    res.status(200).json({
      news: newsData.articles
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update User Preferences.
 * 
 * Body:
 * - categories: string[] (e.g. ['sports', 'health'])
 */
export const updatePreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Error('User not found');

    const { categories } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $set: { 
          'preferences.categories': categories || ['general']
        } 
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      success: true, 
      data: updatedUser?.preferences 
    });
  } catch (err) {
    next(err);
  }
};