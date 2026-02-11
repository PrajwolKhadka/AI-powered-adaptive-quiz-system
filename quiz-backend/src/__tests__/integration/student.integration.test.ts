import request from "supertest";
import app from "../../app";
import { connectDatabaseTest } from "../../database/db";
import mongoose from "mongoose";
import { Student } from "../../models/student.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let studentToken: string;
let studentId: string;

beforeAll(async () => {
  await connectDatabaseTest();
    await mongoose.connection.dropDatabase();
  // Create a real student in the test database
  const hashedPassword = await bcrypt.hash("TestPassword123", 10);
  const student = await Student.create({
    fullName: "Test Student",
    email: "teststudent@example.com",
    password: hashedPassword,
    className: "10A",
    schoolId: new mongoose.Types.ObjectId(), // Mock school ID
    isFirstLogin: false,
    role: "STUDENT"
  });

  studentId = student._id.toString();

  // Generate token with real student ID and correct role
  studentToken = jwt.sign(
    { id: studentId, role: "STUDENT" },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
}, 15000);

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
}, 15000);

describe("Student Routes", () => {
  test("Student accessing protected route", async () => {
    const res = await request(app)
      .get("/api/student/profile")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("fullName");
    expect(res.body.data.fullName).toBe("Test Student");
    expect(res.body.data.email).toBe("teststudent@example.com");
    expect(res.body.data.className).toBe("10A");
  }, 15000);

  test("Student without token should fail", async () => {
    const res = await request(app).get("/api/student/profile");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Authorization header missing");
  }, 15000);

  test("Non-student role should be forbidden", async () => {
    // Create a token with SCHOOL role instead of STUDENT
    const schoolToken = jwt.sign(
      { id: studentId, role: "SCHOOL" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const res = await request(app)
      .get("/api/student/profile")
      .set("Authorization", `Bearer ${schoolToken}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Student access only");
  }, 15000);
});