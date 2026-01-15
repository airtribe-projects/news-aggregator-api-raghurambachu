import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";
import jwt from "jsonwebtoken";
import User from "../model/User";

// Mock the News Service to avoid hitting external API
jest.mock("../services/newsService");
const newsService = require("../services/newsService");

describe("News Integration (Tests)", () => {
  let mongoServer: MongoMemoryServer;
  let token: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Create a user with preferences
    const user = await User.create({
      username: "newsuser",
      email: "news@test.com",
      password: "password",
      preferences: { categories: ["technology"] }, // No sources!
    });
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });
  });

  it("should fetch news using user preferences", async () => {
    // Mock the service response
    const mockArticles = [
      {
        title: "TypeScript 5.0 Released",
        description: "New features...",
        source: { id: null, name: "TechDaily" },
      },
    ];

    newsService.fetchNews.mockResolvedValue({
      articles: mockArticles,
      totalResults: 1,
    });

    const res = await request(app)
      .get("/api/news")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe("TypeScript 5.0 Released");

    // Ensure service was called with the correct preferences
    expect(newsService.fetchNews).toHaveBeenCalledWith(
      { categories: ["technology"] },
      1,
      undefined
    );
  });

  it("should update user preferences (Categories only)", async () => {
    const res = await request(app)
      .put("/api/news/preferences")
      .set("Authorization", `Bearer ${token}`)
      .send({ categories: ["health", "sports"] });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.categories).toEqual(["health", "sports"]);
  });

  it("should fail to get news without token", async () => {
    const res = await request(app).get("/api/news");
    expect(res.statusCode).toEqual(401);
  });
});
