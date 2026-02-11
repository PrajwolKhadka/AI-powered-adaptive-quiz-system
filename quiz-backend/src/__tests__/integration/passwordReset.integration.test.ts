import request from "supertest";
import app from "../../app";
import { connectDatabaseTest } from "../../database/db";
import mongoose from "mongoose";
import { SchoolModel } from "../../models/school.model";
import bcrypt from "bcrypt";

let schoolEmail: string;
let resetToken: string;

beforeAll(async () => {
  await connectDatabaseTest();
  
  await mongoose.connection.collection('schools').deleteMany({});

  schoolEmail = "resettest@example.com";
  const hashedPassword = await bcrypt.hash("OldPassword123", 10);
  
  await SchoolModel.create({
    name: "Reset Test School",
    email: schoolEmail,
    password: hashedPassword,
    pan: "987654321",
    contactNumber: "1234567890",
    instituteType: "PRIVATE",
    location: {
      city: "Test City",
      district: "Test District"
    }
  });
}, 15000);

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
}, 15000);

describe("Password Reset Flow", () => {
  test("Request password reset", async () => {
    const res = await request(app)
      .post("/api/school/auth/forgot-password")
      .send({ email: schoolEmail });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/reset link has been sent/i);
  }, 15000);

  test("Reset password with invalid token should fail", async () => {
    const res = await request(app)
      .put("/api/school/auth/reset-password")
      .send({
        token: "invalid_token_12345",
        newPassword: "NewPassword123"
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  }, 15000);
});