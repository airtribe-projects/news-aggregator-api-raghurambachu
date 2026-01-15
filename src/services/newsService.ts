import axios from 'axios';
import { IPreferences, INewsArticle } from '../types';

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30;

const getOrSetCache = <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    console.log(`[Cache Hit] for key: ${key}`);
    return Promise.resolve(cached.data as T);
  }

  return fetcher().then(data => {
    cache.set(key, { data, timestamp: now });
    console.log(`[Cache Miss] Fetched and cached key: ${key}`);
    return data;
  });
};

export const fetchNews = async (
  preferences: IPreferences, 
  page: number = 1, 
  query?: string
): Promise<{ articles: INewsArticle[]; totalResults: number }> => {
  
  // Create a unique cache key based on inputs
  const cacheKey = `news_${JSON.stringify(preferences)}_p${page}_q${query || ''}`;

  return getOrSetCache(cacheKey, async () => {
    let url = '';
    const pageSize = 10;

    // Priority 1: Search Query (Search across all topics)
    if (query) {
      url = `${BASE_URL}/everything?apiKey=${API_KEY}&q=${encodeURIComponent(query)}&language=en&page=${page}&pageSize=${pageSize}`;
    } 
    // Priority 2: User Categories (Get top headlines for specific topics)
    else if (preferences.categories && preferences.categories.length > 0) {
      // We take the first selected category for simplicity (e.g., 'technology')
      const category = preferences.categories[0];
      url = `${BASE_URL}/top-headlines?apiKey=${API_KEY}&category=${category}&language=en&page=${page}&pageSize=${pageSize}`;
    } 
    // Priority 3: Fallback (General Headlines)
    else {
      url = `${BASE_URL}/top-headlines?apiKey=${API_KEY}&country=us&page=${page}&pageSize=${pageSize}`;
    }

    const response = await axios.get(url);
    return {
      articles: response.data.articles,
      totalResults: response.data.totalResults
    };
  });
};