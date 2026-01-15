import { Document } from "mongoose";

export interface IPreferences {
  categories: string[];
}

export interface IUser {
  username: string;
  email: string;
  password: string;
  preferences: IPreferences;
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface INewsSource {
  id: string | null;
  name: string;
}

export interface INewsArticle {
  source: INewsSource;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}
