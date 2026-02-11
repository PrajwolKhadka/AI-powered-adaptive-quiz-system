import request from "supertest";
import app from "../../app";
import { connectDatabaseTest } from "../../database/db";
import mongoose from "mongoose";

beforeAll(async () => {
  await connectDatabaseTest();
  await mongoose.connection.dropDatabase();
}, 15000);

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
}, 15000);

describe("Auth Routes", () => {
  const email = "testschool@example.com";
  const password = "TestPassword123";
  const name = "Test School";

 test("School signup should succeed", async () => {
  const res = await request(app)
    .post("/api/school/auth/register-school")
    .send({ 
      email, 
      password, 
      name,
      pan: "123456789",
      contactNumber: "9876543210",
      instituteType: "PRIVATE",
       location: { 
          city: "Test City",
          district: "Test District"
        }
    });
     console.log("Signup Response:", res.status, res.body); 
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toBe("Registration successful");
}, 15000);

  test("School login should succeed", async () => {
    const res = await request(app)
      .post("/api/school/auth/login")
      .send({ email, password });
 console.log("Login Response:", res.status, res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.success).toBe(true);
  }, 15000);

  test("Login with wrong password should fail", async () => {
    const res = await request(app)
      .post("/api/school/auth/login")
      .send({ email, password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
    expect(res.body.success).toBe(false);
  }, 15000);
});