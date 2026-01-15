import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";
import User from "../model/User";

describe("Authentication (Tests)", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "johndoe",
      email: "john@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it("should fail registration with invalid email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "johndoe",
      email: "notanemail",
      password: "password123",
    });

    expect(res.statusCode).toEqual(400); // Validation Error
  });

  it("should login successfully", async () => {
    // Setup
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
      });

    // Action
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "john@example.com", password: "password123" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });
});
