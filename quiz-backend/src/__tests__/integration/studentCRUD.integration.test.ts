import request from "supertest";
import app from "../../app";
import { connectDatabaseTest } from "../../database/db";
import mongoose from "mongoose";
import { SchoolModel } from "../../models/school.model"; // Import this
import bcrypt from "bcrypt";

let token: string;
let studentId: string;
let schoolId: string;

beforeAll(async () => {
  await connectDatabaseTest();
// Clean up existing data first
await mongoose.connection.dropDatabase();
  // Create a school user first
  const hashedPassword = await bcrypt.hash("Test1234!", 10);
  const school = await SchoolModel.create({
    name: "Test School",
    email: "testschool@example.com",
    password: hashedPassword,
    pan: "123456789",
    contactNumber: "9876543210",
    instituteType: "PRIVATE",
    location: {
      city: "Test City",
      district: "Test District"
    }
  });

  schoolId = school._id.toString();

  // Login to get token
  const loginRes = await request(app)
    .post("/api/school/auth/login")
    .send({ 
      email: "testschool@example.com", 
      password: "Test1234!" 
    });

  token = loginRes.body.token;
}, 15000);

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
}, 15000);

describe("Student CRUD Integration", () => {
  test("Create student", async () => {
    const res = await request(app)
      .post("/api/school/create-student")
      .set("Authorization", `Bearer ${token}`)
      .field("fullName", "John Doe")
      .field("email", "johndoe@example.com")
      .field("password", "Student123!")
      .field("className", "10A");

    console.log("Create Response:", res.status, res.body); // Debug

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("studentId"); // Changed from student._id
    expect(res.body.message).toBe("Student created");
    studentId = res.body.studentId; // Changed
  }, 15000);

  test("Get all students", async () => {
    const res = await request(app)
      .get("/api/school/students")
      .set("Authorization", `Bearer ${token}`);

    console.log("Get All Response:", res.status, res.body); // Debug

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true); // Added
    expect(res.body.students).toBeDefined();
    expect(res.body.students.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("page");
  }, 15000);

  test("Get student by ID", async () => {
    const res = await request(app)
      .get(`/api/school/students/${studentId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("Get By ID Response:", res.status, res.body); // Debug

    expect(res.status).toBe(200);
    // Controller returns raw student object, not wrapped
    expect(res.body._id).toBe(studentId);
    expect(res.body.fullName).toBe("John Doe");
  }, 15000);

  test("Update student", async () => {
    const res = await request(app)
      .put(`/api/school/students/${studentId}`)
      .set("Authorization", `Bearer ${token}`)
      .field("fullName", "John Updated");

    console.log("Update Response:", res.status, res.body); // Debug

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Student updated successfully");
    expect(res.body.student.fullName).toBe("John Updated");
  }, 15000);

  test("Update student password", async () => {
    const res = await request(app)
      .put(`/api/school/students/${studentId}/password`)
      .set("Authorization", `Bearer ${token}`)
      .send({ password: "NewPass123!" }); // Changed from newPassword

    console.log("Update Password Response:", res.status, res.body); // Debug

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Password updated successfully");
  }, 15000);

  test("Delete student", async () => {
    const res = await request(app)
      .delete(`/api/school/students/${studentId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("Delete Response:", res.status, res.body); // Debug

    expect(res.status).toBe(204); // Changed from 200
    // 204 No Content means no body to check
  }, 15000);
});