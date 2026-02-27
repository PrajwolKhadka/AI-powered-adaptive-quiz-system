import request from "supertest";
import app from "../../app";
import { connectDatabaseTest } from "../../database/db";
import mongoose from "mongoose";
import { SchoolModel } from "../../models/school.model";
import { Student } from "../../models/student.model";
import { QuizModel } from "../../models/quiz.model";
import { QuestionModel } from "../../models/questions.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let schoolToken: string;
let studentToken: string;
let schoolId: string;
let quizId: string;

beforeAll(async () => {
  await connectDatabaseTest();
  await mongoose.connection.dropDatabase();

  // Create school
  const hashedPassword = await bcrypt.hash("Test1234!", 10);
  const school = await SchoolModel.create({
    name: "Quiz Test School",
    email: "quizschool@example.com",
    password: hashedPassword,
    pan: "123456789",
    contactNumber: "9876543210",
    instituteType: "PRIVATE",
    location: { city: "Test City", district: "Test District" },
  });

  schoolId = school._id.toString();

  const loginRes = await request(app)
    .post("/api/school/auth/login")
    .send({ email: "quizschool@example.com", password: "Test1234!" });

  schoolToken = loginRes.body.token;

  // Create student
  const student = await Student.create({
    fullName: "Quiz Student",
    email: "quizstudent@example.com",
    password: await bcrypt.hash("Pass123!", 10),
    className: 10,
    schoolId: school._id,
    role: "STUDENT",
    isFirstLogin: false,
  });

  studentToken = jwt.sign(
    { id: student._id.toString(), role: "STUDENT" },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );


  await QuestionModel.insertMany([
    {
      questionNumber: 1,
      schoolId: school._id,
      subject: "Maths",
      question: "What is 2+2?",
      options: { a: "1", b: "2", c: "4", d: "5" },
      correctAnswer: "c",
      difficulty: "EASY",
    },
    {
      questionNumber: 2,
      schoolId: school._id,
      subject: "Maths",
      question: "What is 5x5?",
      options: { a: "10", b: "25", c: "20", d: "15" },
      correctAnswer: "b",
      difficulty: "MEDIUM",
    },
  ]);
}, 15000);

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
}, 15000);


describe("POST /api/school/quiz/toggle", () => {
  test("School can create a new active quiz", async () => {
    const res = await request(app)
      .post("/api/school/quiz/toggle")
      .set("Authorization", `Bearer ${schoolToken}`)
      .send({
        classLevel: 10,
        subject: "Maths",
        durationMinutes: 30,
        isActive: true,
      });

    console.log("Create Quiz Response:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.quiz).toHaveProperty("_id");
    expect(res.body.quiz.isActive).toBe(true);
    expect(res.body.quiz.subject).toBe("Maths");
    expect(res.body.quiz.classLevel).toBe(10);
    expect(res.body.quiz.durationMinutes).toBe(30);
    expect(res.body.quiz).toHaveProperty("startTime");
    expect(res.body.quiz).toHaveProperty("endTime");

    quizId = res.body.quiz._id;
  }, 15000);

  test("School can create an inactive quiz (no startTime/endTime)", async () => {
    const res = await request(app)
      .post("/api/school/quiz/toggle")
      .set("Authorization", `Bearer ${schoolToken}`)
      .send({
        classLevel: 8,
        subject: "Science",
        durationMinutes: 20,
        isActive: false,
      });

    console.log("Inactive Quiz Response:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.quiz.isActive).toBe(false);
    expect(res.body.quiz.startTime).toBeNull();
    expect(res.body.quiz.endTime).toBeNull();
  }, 15000);

  test("School can update (toggle off) an existing quiz by quizId", async () => {
    const res = await request(app)
      .post("/api/school/quiz/toggle")
      .set("Authorization", `Bearer ${schoolToken}`)
      .send({
        quizId,
        classLevel: 10,
        subject: "Maths",
        durationMinutes: 30,
        isActive: false,
      });

    console.log("Toggle Off Response:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.quiz._id).toBe(quizId);
    expect(res.body.quiz.isActive).toBe(false);
    expect(res.body.quiz.startTime).toBeNull();
    expect(res.body.quiz.endTime).toBeNull();
  }, 15000);

  test("School can toggle an existing quiz back on by quizId", async () => {
    const res = await request(app)
      .post("/api/school/quiz/toggle")
      .set("Authorization", `Bearer ${schoolToken}`)
      .send({
        quizId,
        classLevel: 10,
        subject: "Maths",
        durationMinutes: 15,
        isActive: true,
      });

    console.log("Toggle On Response:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.quiz.isActive).toBe(true);
    expect(res.body.quiz.durationMinutes).toBe(15);

    quizId = res.body.quiz._id;
  }, 15000);

  test("Toggle with a non-existent quizId should return 500", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .post("/api/school/quiz/toggle")
      .set("Authorization", `Bearer ${schoolToken}`)
      .send({
        quizId: fakeId,
        classLevel: 10,
        subject: "Maths",
        durationMinutes: 30,
        isActive: true,
      });

    console.log("Non-existent Quiz Toggle Response:", res.status, res.body);

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Quiz not found");
  }, 15000);

  test("Toggle with invalid subject should fail validation", async () => {
    const res = await request(app)
      .post("/api/school/quiz/toggle")
      .set("Authorization", `Bearer ${schoolToken}`)
      .send({
        classLevel: 10,
        subject: "Physics",
        durationMinutes: 30,
        isActive: true,
      });

    console.log("Invalid Subject Response:", res.status, res.body);

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  }, 15000);

  test("Toggle with classLevel out of range should fail validation", async () => {
    const res = await request(app)
      .post("/api/school/quiz/toggle")
      .set("Authorization", `Bearer ${schoolToken}`)
      .send({
        classLevel: 13,
        subject: "Maths",
        durationMinutes: 30,
        isActive: true,
      });

    console.log("Out of Range ClassLevel Response:", res.status, res.body);

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  }, 15000);

  test("Toggle with durationMinutes out of range should fail validation", async () => {
    const res = await request(app)
      .post("/api/school/quiz/toggle")
      .set("Authorization", `Bearer ${schoolToken}`)
      .send({
        classLevel: 10,
        subject: "Maths",
        durationMinutes: 90,
        isActive: true,
      });

    console.log("Out of Range Duration Response:", res.status, res.body);

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  }, 15000);

  test("Toggle with missing required fields should fail", async () => {
    const res = await request(app)
      .post("/api/school/quiz/toggle")
      .set("Authorization", `Bearer ${schoolToken}`)
      .send({
        subject: "Maths",
        // missing classLevel, durationMinutes, isActive
      });

    console.log("Missing Fields Response:", res.status, res.body);

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  }, 15000);

  test("Student cannot access toggle route (403)", async () => {
    const res = await request(app)
      .post("/api/school/quiz/toggle")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        classLevel: 10,
        subject: "Maths",
        durationMinutes: 30,
        isActive: true,
      });

    console.log("Student Toggle Attempt:", res.status, res.body);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("School access only");
  }, 15000);

  test("Unauthenticated user cannot access toggle route (401)", async () => {
    const res = await request(app)
      .post("/api/school/quiz/toggle")
      .send({
        classLevel: 10,
        subject: "Maths",
        durationMinutes: 30,
        isActive: true,
      });

    console.log("Unauthenticated Toggle Attempt:", res.status, res.body);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Authorization header missing");
  }, 15000);
});

describe("GET /api/student/quiz", () => {
  test("Student can fetch an active, non-expired quiz", async () => {
    const res = await request(app)
      .get(`/api/student/quiz?quizId=${quizId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    console.log("Student Fetch Active Quiz:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.quiz).toHaveProperty("_id");
    expect(res.body.quiz.isActive).toBe(true);

    // Correct answers must NOT be exposed to students
    const questions = res.body.quiz.questionIds;
    if (questions && questions.length > 0) {
      questions.forEach((q: any) => {
        expect(q).not.toHaveProperty("correctAnswer");
      });
    }
  }, 15000);

  test("Student cannot fetch an inactive quiz (returns 400)", async () => {
    // Create an inactive quiz directly
    const inactiveQuiz = await QuizModel.create({
      schoolId: new mongoose.Types.ObjectId(schoolId),
      subject: "English",
      classLevel: 9,
      isActive: false,
      durationMinutes: 20,
      startTime: null,
      endTime: null,
    });

    const res = await request(app)
      .get(`/api/student/quiz?quizId=${inactiveQuiz._id}`)
      .set("Authorization", `Bearer ${studentToken}`);

    console.log("Inactive Quiz Fetch:", res.status, res.body);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Quiz not found");
  }, 15000);

  test("Student cannot fetch an expired quiz (endTime in past)", async () => {
    // Create an active quiz that has already ended
    const expiredQuiz = await QuizModel.create({
      schoolId: new mongoose.Types.ObjectId(schoolId),
      subject: "Nepali",
      classLevel: 7,
      isActive: true,
      durationMinutes: 10,
      startTime: new Date(Date.now() - 20 * 60 * 1000), 
      endTime: new Date(Date.now() - 10 * 60 * 1000), 
    });

    const res = await request(app)
      .get(`/api/student/quiz?quizId=${expiredQuiz._id}`)
      .set("Authorization", `Bearer ${studentToken}`);

    console.log("Expired Quiz Fetch:", res.status, res.body);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Quiz not found");
  }, 15000);

  test("Student fetching non-existent quizId returns 400", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .get(`/api/student/quiz?quizId=${fakeId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    console.log("Non-existent Quiz Fetch:", res.status, res.body);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Quiz not found");
  }, 15000);

  test("Fetch quiz without quizId param should fail validation", async () => {
    const res = await request(app)
      .get("/api/student/quiz")
      .set("Authorization", `Bearer ${studentToken}`);

    console.log("Missing quizId Param:", res.status, res.body);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  }, 15000);

  test("School cannot access student quiz fetch route (403)", async () => {
    const res = await request(app)
      .get(`/api/student/quiz?quizId=${quizId}`)
      .set("Authorization", `Bearer ${schoolToken}`);

    console.log("School Quiz Fetch Attempt:", res.status, res.body);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Student access only");
  }, 15000);

  test("Unauthenticated user cannot access student quiz route (401)", async () => {
    const res = await request(app)
      .get(`/api/student/quiz?quizId=${quizId}`);

    console.log("Unauthenticated Quiz Fetch:", res.status, res.body);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Authorization header missing");
  }, 15000);

  test("Invalid token on student quiz fetch returns 401", async () => {
    const res = await request(app)
      .get(`/api/student/quiz?quizId=${quizId}`)
      .set("Authorization", "Bearer totally_invalid_token");

    console.log("Invalid Token Quiz Fetch:", res.status, res.body);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid or expired token");
  }, 15000);
});