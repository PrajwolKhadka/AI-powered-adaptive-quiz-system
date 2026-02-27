import request from "supertest";
import app from "../../app";
import { connectDatabaseTest } from "../../database/db";
import mongoose from "mongoose";
import { SchoolModel } from "../../models/school.model";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

let token: string;
let questionId: string;
let schoolId: string;

beforeAll(async () => {
  await connectDatabaseTest();
  
  // Clean up database
  await mongoose.connection.collection('schools').deleteMany({});
  await mongoose.connection.collection('questions').deleteMany({});

  // Create a school first
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
    .send({ email: "testschool@example.com", password: "Test1234!" });
  
  token = loginRes.body.token;
}, 15000);

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
}, 15000);

describe("Question CRUD & CSV Integration", () => {
  let csvPath: string;

  beforeEach(() => {
    csvPath = path.join(__dirname, "sample_questions.csv");
  });

  afterEach(() => {
    // Cleanup CSV file if it exists
    if (fs.existsSync(csvPath)) {
      fs.unlinkSync(csvPath);
    }
  });

  test("Upload CSV of questions", async () => {
    // Create a temp CSV for testing
    const csvContent = `question number,question,option a,option b,option c,option d,right answer,subject,difficulty
1,What is 2+2?,2,3,4,5,c,Math,VERY EASY
2,Capital of France?,London,Berlin,Paris,Rome,c,Geography,EASY`;
    
    fs.writeFileSync(csvPath, csvContent);

    const res = await request(app)
      .post("/api/school/upload-csv")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", csvPath);

    console.log("CSV Upload Response:", res.status, res.body);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("CSV processed successfully");
    expect(res.body.inserted).toBe(2);
    expect(res.body.failed).toBe(0);
  }, 15000);

  test("Get all questions", async () => {
    const res = await request(app)
      .get("/api/school/questions")
      .set("Authorization", `Bearer ${token}`);

    console.log("Get Questions Response:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("questions");
    expect(res.body.questions.length).toBeGreaterThan(0);
    
    // Store first question ID for later tests
    questionId = res.body.questions[0]._id;
  }, 15000);

  test("Update a question", async () => {
    const res = await request(app)
      .put(`/api/school/questions/${questionId}`) 
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "Updated question?",
        options: { a: "1", b: "2", c: "3", d: "4" },
        correctAnswer: "a",
        subject: "Math",
        difficulty: "EASY",
      });

    console.log("Update Question Response:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Question updated");
    expect(res.body.question.question).toBe("Updated question?");
  }, 15000);

  test("Delete a question", async () => {
    const res = await request(app)
      .delete(`/api/school/questions/${questionId}`) 
      .set("Authorization", `Bearer ${token}`);

    console.log("Delete Question Response:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Question deleted");
  }, 15000);

  test("Batch delete questions", async () => {
    const csvContent = `question number,question,option a,option b,option c,option d,right answer,subject,difficulty
3,What is 5+5?,8,9,10,11,c,Math,EASY
4,Capital of Italy?,Madrid,Rome,Athens,Vienna,b,Geography,MEDIUM`;
    
    fs.writeFileSync(csvPath, csvContent);

    await request(app)
      .post("/api/school/upload-csv")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", csvPath);

    // Get all questions
    const allQuestions = await request(app)
      .get("/api/school/questions")
      .set("Authorization", `Bearer ${token}`);

    const ids = allQuestions.body.questions.map((q: any) => q._id);

    // Batch delete
    const res = await request(app)
      .post("/api/school/questions/delete-batch")
      .set("Authorization", `Bearer ${token}`)
      .send({ questionIds: ids });

    console.log("Batch Delete Response:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/\d+ questions deleted/);
    
    // Verify all questions are deleted
    const remainingQuestions = await request(app)
      .get("/api/school/questions")
      .set("Authorization", `Bearer ${token}`);
    
    expect(remainingQuestions.body.questions.length).toBe(0);
  }, 15000);
});