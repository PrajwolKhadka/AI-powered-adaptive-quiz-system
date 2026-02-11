import request from "supertest";
import app from "../../app";
import { connectDatabaseTest } from "../../database/db";
import mongoose from "mongoose";
import { SchoolModel } from "../../models/school.model";
import { Student } from "../../models/student.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let schoolToken: string;
let studentToken: string;

beforeAll(async () => {
  await connectDatabaseTest();
  
  await mongoose.connection.collection('schools').deleteMany({});
  await mongoose.connection.collection('students').deleteMany({});

  // Create school
  const hashedPassword = await bcrypt.hash("Test1234!", 10);
  const school = await SchoolModel.create({
    name: "Auth Test School",
    email: "authtest@example.com",
    password: hashedPassword,
    pan: "444555666",
    contactNumber: "8888888888",
    instituteType: "PRIVATE",
    location: {
      city: "Test City",
      district: "Test District"
    }
  });

  const loginRes = await request(app)
    .post("/api/school/auth/login")
    .send({ email: "authtest@example.com", password: "Test1234!" });
  
  schoolToken = loginRes.body.token;

  // Create student
  const student = await Student.create({
    fullName: "Auth Test Student",
    email: "authstudent@test.com",
    password: await bcrypt.hash("Pass123!", 10),
    className: "10A",
    schoolId: school._id,
    role: "STUDENT"
  });

  studentToken = jwt.sign(
    { id: student._id.toString(), role: "STUDENT" },
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

describe("Authorization & Roles", () => {
  test("School can access school-only routes", async () => {
    const res = await request(app)
      .get("/api/school/students")
      .set("Authorization", `Bearer ${schoolToken}`);

    expect(res.status).toBe(200);
  }, 15000);

  test("Student cannot access school-only routes", async () => {
    const res = await request(app)
      .get("/api/school/students")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("School access only");
  }, 15000);

  test("Unauthenticated user cannot access protected routes", async () => {
    const res = await request(app)
      .get("/api/school/students");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Authorization header missing");
  }, 15000);

  test("Invalid token should be rejected", async () => {
    const res = await request(app)
      .get("/api/school/students")
      .set("Authorization", "Bearer invalid_token_here");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid or expired token");
  }, 15000);
});