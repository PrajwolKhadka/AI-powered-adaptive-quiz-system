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
let studentId: string;
let quizId: string;
let questionId: string;
let schoolId: string;

beforeAll(async () => {
  await connectDatabaseTest();
  await mongoose.connection.dropDatabase();

  // Create school
  const hashedPassword = await bcrypt.hash("Test1234!", 10);
  const school = await SchoolModel.create({
    name: "StudentQuiz Test School",
    email: "studentquiz@example.com",
    password: hashedPassword,
    pan: "123456789",
    contactNumber: "9876543210",
    instituteType: "PRIVATE",
    location: { city: "Test City", district: "Test District" },
  });

  schoolId = school._id.toString();

  const loginRes = await request(app)
    .post("/api/school/auth/login")
    .send({ email: "studentquiz@example.com", password: "Test1234!" });

  schoolToken = loginRes.body.token;

  const student = await Student.create({
    fullName: "Quiz Student",
    email: "quizstudent@example.com",
    password: await bcrypt.hash("Pass123!", 10),
    className: 10,
    schoolId: school._id,
    role: "STUDENT",
    isFirstLogin: false,
  });

  studentId = student._id.toString();

  studentToken = jwt.sign(
    { id: studentId, role: "STUDENT" },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );


  const questions = await QuestionModel.insertMany([
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
    {
      questionNumber: 3,
      schoolId: school._id,
      subject: "Maths",
      question: "What is 10/2?",
      options: { a: "2", b: "3", c: "5", d: "6" },
      correctAnswer: "c",
      difficulty: "EASY",
    },
  ]);

  questionId = questions[0]._id.toString();

  const now = new Date();
  const quiz = await QuizModel.create({
    schoolId: school._id,
    subject: "Maths",
    classLevel: 10,
    questionIds: questions.map((q) => q._id),
    isActive: true,
    durationMinutes: 30,
    startTime: now,
    endTime: new Date(now.getTime() + 30 * 60 * 1000),
  });

  quizId = quiz._id.toString();
}, 20000);

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
}, 15000);


describe("GET /api/student/active-quiz", () => {
  test("Student gets active quiz for their class level", async () => {
    const res = await request(app)
      .get("/api/student/active-quiz")
      .set("Authorization", `Bearer ${studentToken}`);

    console.log("Active Quiz Response:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.available).toBe(true);
    expect(res.body).toHaveProperty("quizId");
    expect(res.body).toHaveProperty("subject");
    expect(res.body).toHaveProperty("endTime");
    expect(res.body.subject).toBe("Maths");
  }, 15000);

  test("Student with no active quiz for their class returns available: false", async () => {
    const otherStudent = await Student.create({
      fullName: "No Quiz Student",
      email: "noquiz@example.com",
      password: await bcrypt.hash("Pass123!", 10),
      className: 11,
      schoolId: new mongoose.Types.ObjectId(schoolId),
      role: "STUDENT",
      isFirstLogin: false,
    });

    const otherToken = jwt.sign(
      { id: otherStudent._id.toString(), role: "STUDENT" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const res = await request(app)
      .get("/api/student/active-quiz")
      .set("Authorization", `Bearer ${otherToken}`);

    console.log("No Active Quiz Response:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.available).toBe(false);
  }, 15000);

  test("Unauthenticated request returns 401", async () => {
    const res = await request(app).get("/api/student/active-quiz");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Authorization header missing");
  }, 15000);

  test("School token cannot access active-quiz route (403)", async () => {
    const res = await request(app)
      .get("/api/student/active-quiz")
      .set("Authorization", `Bearer ${schoolToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Student access only");
  }, 15000);
});

describe("POST /api/student/next-question", () => {
  test("Student gets first question from active quiz", async () => {
    const res = await request(app)
      .post("/api/student/next-question")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ quizId });

    console.log("Next Question Response:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("question");
    expect(res.body.question).toHaveProperty("_id");
    expect(res.body.question).toHaveProperty("text");
    expect(res.body.question).toHaveProperty("options");
    expect(res.body.question).toHaveProperty("difficulty");
    expect(res.body.question).toHaveProperty("subject");
    expect(res.body.question).toHaveProperty("progress");
    expect(res.body.question.progress).toHaveProperty("answered");
    expect(res.body.question.progress).toHaveProperty("total");

    expect(res.body.question).not.toHaveProperty("correctAnswer");
  }, 15000);

  test("Next question with non-existent quizId returns 400", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .post("/api/student/next-question")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ quizId: fakeId });

    console.log("Non-existent Quiz Next Question:", res.status, res.body);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Quiz not found");
  }, 15000);

  test("Next question with missing quizId returns 400", async () => {
    const res = await request(app)
      .post("/api/student/next-question")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({});

    console.log("Missing quizId Next Question:", res.status, res.body);

    expect(res.status).toBe(400);
  }, 15000);

  test("Next question on expired quiz returns 400", async () => {

    const expiredQuiz = await QuizModel.create({
      schoolId: new mongoose.Types.ObjectId(schoolId),
      subject: "Maths",
      classLevel: 10,
      questionIds: [new mongoose.Types.ObjectId(questionId)],
      isActive: true,
      durationMinutes: 1,
      startTime: new Date(Date.now() - 10 * 60 * 1000),
      endTime: new Date(Date.now() - 5 * 60 * 1000),
    });

    const res = await request(app)
      .post("/api/student/next-question")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ quizId: expiredQuiz._id.toString() });

    console.log("Expired Quiz Next Question:", res.status, res.body);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Quiz has expired");
  }, 15000);

  test("Next question on inactive quiz returns 400", async () => {
    const inactiveQuiz = await QuizModel.create({
      schoolId: new mongoose.Types.ObjectId(schoolId),
      subject: "Maths",
      classLevel: 10,
      questionIds: [new mongoose.Types.ObjectId(questionId)],
      isActive: false,
      durationMinutes: 30,
      startTime: null,
      endTime: null,
    });

    const res = await request(app)
      .post("/api/student/next-question")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ quizId: inactiveQuiz._id.toString() });

    console.log("Inactive Quiz Next Question:", res.status, res.body);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Quiz is not active");
  }, 15000);

  test("Unauthenticated request returns 401", async () => {
    const res = await request(app)
      .post("/api/student/next-question")
      .send({ quizId });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Authorization header missing");
  }, 15000);

  test("School token cannot access next-question route (403)", async () => {
    const res = await request(app)
      .post("/api/student/next-question")
      .set("Authorization", `Bearer ${schoolToken}`)
      .send({ quizId });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Student access only");
  }, 15000);
});

describe("POST /api/student/submit-answer", () => {
  test("Student submits a correct answer successfully", async () => {
    const res = await request(app)
      .post("/api/student/submit-answer")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        quizId,
        questionId,
        selectedOption: "c", 
        timeTaken: 8,
      });

    console.log("Submit Correct Answer:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("correct");
    expect(res.body.correct).toBe(true);
  }, 15000);

  test("Student submits a wrong answer successfully", async () => {

    const question2Id = (
      await QuestionModel.findOne({ questionNumber: 2 })
    )?._id.toString();

    const res = await request(app)
      .post("/api/student/submit-answer")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        quizId,
        questionId: question2Id,
        selectedOption: "a", 
        timeTaken: 12,
      });

    console.log("Submit Wrong Answer:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("correct");
    expect(res.body.correct).toBe(false);
  }, 15000);

  test("Student cannot submit the same question twice (409 / duplicate)", async () => {

    const res = await request(app)
      .post("/api/student/submit-answer")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        quizId,
        questionId,
        selectedOption: "c",
        timeTaken: 5,
      });

    console.log("Duplicate Answer:", res.status, res.body);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Question already answered");
  }, 15000);

  test("Submit answer for non-existent questionId returns 400", async () => {
    const fakeQuestionId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .post("/api/student/submit-answer")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        quizId,
        questionId: fakeQuestionId,
        selectedOption: "a",
        timeTaken: 5,
      });

    console.log("Non-existent Question Submit:", res.status, res.body);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Question not found");
  }, 15000);

  test("Submit answer with missing fields returns 400", async () => {
    const res = await request(app)
      .post("/api/student/submit-answer")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        quizId,
        // missing questionId, selectedOption, timeTaken
      });

    console.log("Missing Fields Submit:", res.status, res.body);

    expect(res.status).toBe(400);
  }, 15000);


  test("Unauthenticated request returns 401", async () => {
    const res = await request(app)
      .post("/api/student/submit-answer")
      .send({
        quizId,
        questionId,
        selectedOption: "c",
        timeTaken: 5,
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Authorization header missing");
  }, 15000);

  test("School token cannot access submit-answer route (403)", async () => {
    const res = await request(app)
      .post("/api/student/submit-answer")
      .set("Authorization", `Bearer ${schoolToken}`)
      .send({
        quizId,
        questionId,
        selectedOption: "c",
        timeTaken: 5,
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Student access only");
  }, 15000);
});

describe("Full quiz flow integration", () => {
  let flowStudentToken: string;

  beforeAll(async () => {
    const student = await Student.create({
      fullName: "Flow Student",
      email: "flowstudent@example.com",
      password: await bcrypt.hash("Pass123!", 10),
      className: 10,
      schoolId: new mongoose.Types.ObjectId(schoolId),
      role: "STUDENT",
      isFirstLogin: false,
    });

    flowStudentToken = jwt.sign(
      { id: student._id.toString(), role: "STUDENT" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
  }, 15000);

  test("Student can complete a full next-question → submit-answer cycle", async () => {

    const nextRes = await request(app)
      .post("/api/student/next-question")
      .set("Authorization", `Bearer ${flowStudentToken}`)
      .send({ quizId });

    console.log("Flow - Next Question:", nextRes.status, nextRes.body);

    expect(nextRes.status).toBe(200);
    expect(nextRes.body).toHaveProperty("question");

    const fetchedQuestionId = nextRes.body.question._id;
    const progress = nextRes.body.question.progress;
    expect(progress.answered).toBe(0);

    const submitRes = await request(app)
      .post("/api/student/submit-answer")
      .set("Authorization", `Bearer ${flowStudentToken}`)
      .send({
        quizId,
        questionId: fetchedQuestionId,
        selectedOption: "a",
        timeTaken: 10,
      });

    console.log("Flow - Submit Answer:", submitRes.status, submitRes.body);

    expect(submitRes.status).toBe(200);
    expect(submitRes.body).toHaveProperty("correct");


    const nextRes2 = await request(app)
      .post("/api/student/next-question")
      .set("Authorization", `Bearer ${flowStudentToken}`)
      .send({ quizId });

    console.log("Flow - Next Question 2:", nextRes2.status, nextRes2.body);

    expect(nextRes2.status).toBe(200);
    if (!nextRes2.body.done) {
      expect(nextRes2.body.question.progress.answered).toBe(1);
      // Should not return the same question
      expect(nextRes2.body.question._id).not.toBe(fetchedQuestionId);
    }
  }, 20000);
});