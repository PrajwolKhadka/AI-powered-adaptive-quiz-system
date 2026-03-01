jest.mock("../../models/student.model");
jest.mock("bcrypt");

jest.mock("../../services/schoolresults.service", () => ({
  SchoolResultsService: jest.fn().mockImplementation(() => ({
    getSchoolQuizzes: jest.fn(),
    getAllResultsForSchool: jest.fn(),
    getResultsByQuiz: jest.fn(),
    getStudentResultDetail: jest.fn(),
  })),
}));

jest.mock("../../services/studentresults.service", () => ({
  StudentResultsService: jest.fn().mockImplementation(() => ({
    getStudentHistory: jest.fn(),
    getPerformanceGraph: jest.fn(),
    getStudentResultDetail: jest.fn(),
  })),
}));

import { StudentService } from "../../services/student.service";
import { Student } from "../../models/student.model";
import bcrypt from "bcrypt";
import { SchoolResultsService } from "../../services/schoolresults.service";
import { StudentResultsService } from "../../services/studentresults.service";
import { SchoolResultsController } from "../../controllers/schoolresults.controller";
import { StudentResultsController } from "../../controllers/studentresults.controller";
import { verifyPassword } from "../../controllers/studentVerify.controller";

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

const schoolServiceInstance = (SchoolResultsService as jest.Mock).mock.results[0].value;
const studentServiceInstance = (StudentResultsService as jest.Mock).mock.results[0].value;

const makeStudent = (overrides = {}): any => ({
  _id: "student1",
  imageUrl: null,
  isFirstLogin: true,
  password: "hashed",
  save: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

const makeReq = (overrides = {}): any => ({
  user: { id: "school1" },
  params: {},
  body: {},
  ...overrides,
});

const makeRes = (): any => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

beforeEach(() => jest.clearAllMocks());

describe("StudentService.uploadProfilePicture", () => {
  test("updates imageUrl and sets isFirstLogin to false", async () => {
    const student = makeStudent();
    (Student.findById as jest.Mock).mockResolvedValue(student);

    await StudentService.uploadProfilePicture("student1", "/uploads/photo.jpg");

    expect(student.imageUrl).toBe("/uploads/photo.jpg");
    expect(student.isFirstLogin).toBe(false);
    expect(student.save).toHaveBeenCalled();
  });

  test("throws 'Student not found' when student does not exist", async () => {
    (Student.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      StudentService.uploadProfilePicture("notExist", "/photo.jpg")
    ).rejects.toThrow("Student not found");
  });

  test("returns the updated student", async () => {
    const student = makeStudent();
    (Student.findById as jest.Mock).mockResolvedValue(student);

    const result = await StudentService.uploadProfilePicture("student1", "/new.jpg");

    expect(result).toBe(student);
  });

  test("calls Student.findById with correct id", async () => {
    (Student.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      StudentService.uploadProfilePicture("stu42", "/img.jpg")
    ).rejects.toThrow();

    expect(Student.findById).toHaveBeenCalledWith("stu42");
  });
});

describe("StudentService.getById", () => {
  test("returns student by id", async () => {
    const student = makeStudent();
    (Student.findById as jest.Mock).mockResolvedValue(student);

    const result = await StudentService.getById("student1");

    expect(Student.findById).toHaveBeenCalledWith("student1");
    expect(result).toBe(student);
  });

  test("returns null when student not found", async () => {
    (Student.findById as jest.Mock).mockResolvedValue(null);

    const result = await StudentService.getById("notExist");

    expect(result).toBeNull();
  });
});


describe("AIFeedbackService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, GEMINI_API_KEY: "test-key" };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("throws error when GEMINI_API_KEY is missing", async () => {
    delete process.env.GEMINI_API_KEY;
    const { AIFeedbackService } = await import("../../services/aiFeedback.service");
    expect(() => new AIFeedbackService()).toThrow("GEMINI_API_KEY not found in environment");
  });

  test("returns fallback string when Gemini API throws", async () => {
    jest.doMock("@google/genai", () => ({
      GoogleGenAI: jest.fn().mockImplementation(() => ({
        models: {
          generateContent: jest.fn().mockRejectedValue(new Error("API error")),
        },
      })),
    }));

    const { AIFeedbackService } = await import("../../services/aiFeedback.service");
    const service = new AIFeedbackService();

    const result = await service.generateQuizFeedback({
      totalQuestions: 10,
      correctAnswers: 7,
      wrongAnswers: 3,
      weakSubjects: ["Maths"],
      avgTime: 8,
    });

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});


describe("SchoolResultsController", () => {
  const controller = new SchoolResultsController();

  describe("getSchoolQuizzes", () => {
    test("returns quizzes on success", async () => {
      schoolServiceInstance.getSchoolQuizzes.mockResolvedValue([{ id: "q1" }]);
      const res = makeRes();

      await controller.getSchoolQuizzes(makeReq(), res);

      expect(res.json).toHaveBeenCalledWith({ quizzes: [{ id: "q1" }] });
    });

    test("returns 500 on service error", async () => {
      schoolServiceInstance.getSchoolQuizzes.mockRejectedValue(new Error("DB error"));
      const res = makeRes();

      await controller.getSchoolQuizzes(makeReq(), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "DB error" });
    });
  });

  describe("getAllResults", () => {
    test("returns all results on success", async () => {
      schoolServiceInstance.getAllResultsForSchool.mockResolvedValue([{ resultId: "r1" }]);
      const res = makeRes();

      await controller.getAllResults(makeReq(), res);

      expect(res.json).toHaveBeenCalledWith({ results: [{ resultId: "r1" }] });
    });

    test("returns 500 on error", async () => {
      schoolServiceInstance.getAllResultsForSchool.mockRejectedValue(new Error("fail"));
      const res = makeRes();

      await controller.getAllResults(makeReq(), res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getQuizResults", () => {
    test("returns quiz results on success", async () => {
      schoolServiceInstance.getResultsByQuiz.mockResolvedValue([{ resultId: "r1" }]);
      const res = makeRes();

      await controller.getQuizResults(makeReq({ params: { quizId: "quiz1" } }), res);

      expect(res.json).toHaveBeenCalledWith({ results: [{ resultId: "r1" }] });
    });

    test("returns 404 when error message includes 'not found'", async () => {
      schoolServiceInstance.getResultsByQuiz.mockRejectedValue(new Error("Quiz not found"));
      const res = makeRes();

      await controller.getQuizResults(makeReq({ params: { quizId: "quiz1" } }), res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    test("returns 500 for general errors", async () => {
      schoolServiceInstance.getResultsByQuiz.mockRejectedValue(new Error("DB error"));
      const res = makeRes();

      await controller.getQuizResults(makeReq({ params: { quizId: "quiz1" } }), res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getStudentResultDetail", () => {
    test("returns student result detail on success", async () => {
      schoolServiceInstance.getStudentResultDetail.mockResolvedValue({ resultId: "r1" });
      const res = makeRes();

      await controller.getStudentResultDetail(
        makeReq({ params: { quizId: "quiz1", studentId: "student1" } }),
        res
      );

      expect(res.json).toHaveBeenCalledWith({ result: { resultId: "r1" } });
    });

    test("returns 404 when result not found", async () => {
      schoolServiceInstance.getStudentResultDetail.mockRejectedValue(new Error("Result not found"));
      const res = makeRes();

      await controller.getStudentResultDetail(
        makeReq({ params: { quizId: "quiz1", studentId: "student1" } }),
        res
      );

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});


describe("StudentResultsController", () => {
  const controller = new StudentResultsController();

  describe("getMyHistory", () => {
    test("returns history and graph on success", async () => {
      studentServiceInstance.getStudentHistory.mockResolvedValue([{ resultId: "r1" }]);
      studentServiceInstance.getPerformanceGraph.mockResolvedValue({ Maths: [] });
      const res = makeRes();

      await controller.getMyHistory(makeReq(), res);

      expect(res.json).toHaveBeenCalledWith({
        history: [{ resultId: "r1" }],
        graph: { Maths: [] },
      });
    });

    test("returns 500 on error", async () => {
      studentServiceInstance.getStudentHistory.mockRejectedValue(new Error("fail"));
      studentServiceInstance.getPerformanceGraph.mockRejectedValue(new Error("fail"));
      const res = makeRes();

      await controller.getMyHistory(makeReq(), res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getMyResultDetail", () => {
    test("returns result detail on success", async () => {
      studentServiceInstance.getStudentResultDetail.mockResolvedValue({ resultId: "r1" });
      const res = makeRes();

      await controller.getMyResultDetail(makeReq({ params: { quizId: "quiz1" } }), res);

      expect(res.json).toHaveBeenCalledWith({ result: { resultId: "r1" } });
    });

    test("returns 404 when result not found", async () => {
      studentServiceInstance.getStudentResultDetail.mockRejectedValue(new Error("Result not found"));
      const res = makeRes();

      await controller.getMyResultDetail(makeReq({ params: { quizId: "quiz1" } }), res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    test("returns 500 for general errors", async () => {
      studentServiceInstance.getStudentResultDetail.mockRejectedValue(new Error("DB error"));
      const res = makeRes();

      await controller.getMyResultDetail(makeReq({ params: { quizId: "quiz1" } }), res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});


describe("verifyPassword controller", () => {
  test("returns valid: true when password matches", async () => {
    (Student.findById as jest.Mock).mockResolvedValue(makeStudent());
    (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
    const res = makeRes();

    await verifyPassword(makeReq({ body: { currentPassword: "mypassword" } }), res);

    expect(res.json).toHaveBeenCalledWith({ valid: true });
  });

  test("returns valid: false when password does not match", async () => {
    (Student.findById as jest.Mock).mockResolvedValue(makeStudent());
    (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);
    const res = makeRes();

    await verifyPassword(makeReq({ body: { currentPassword: "wrongpassword" } }), res);

    expect(res.json).toHaveBeenCalledWith({ valid: false });
  });

  test("returns 400 when currentPassword is missing", async () => {
    const res = makeRes();

    await verifyPassword(makeReq({ body: {} }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ valid: false, message: "Password required" });
  });

  test("returns 404 when student not found", async () => {
    (Student.findById as jest.Mock).mockResolvedValue(null);
    const res = makeRes();

    await verifyPassword(makeReq({ body: { currentPassword: "password" } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ valid: false });
  });

  test("returns 500 on unexpected error", async () => {
    (Student.findById as jest.Mock).mockRejectedValue(new Error("DB error"));
    const res = makeRes();

    await verifyPassword(makeReq({ body: { currentPassword: "password" } }), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ valid: false, message: "DB error" });
  });
});