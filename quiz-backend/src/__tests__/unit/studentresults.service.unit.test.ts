import { StudentResultsService } from "../../services/studentresults.service";

jest.mock("../../repositories/quizresult.repository");

import { QuizResultRepository } from "../../repositories/quizresult.repository";

const mockQuizResultRepo = {
  findByStudent: jest.fn(),
  findByStudentAndQuiz: jest.fn(),
};

(QuizResultRepository as jest.Mock).mockImplementation(() => mockQuizResultRepo);

const makeResult = (overrides = {}): any => ({
  _id: { toString: () => "result1" },
  quizId: {
    _id: { toString: () => "quiz1" },
    subject: "Maths",
    classLevel: 10,
    startTime: new Date("2024-01-01"),
    endTime: new Date("2024-01-02"),
  },
  totalQuestions: 10,
  correctAnswers: 7,
  wrongAnswers: 3,
  timeTaken: 120,
  aiFeedback: "Great work!",
  questionStats: [],
  createdAt: new Date("2024-01-02"),
  ...overrides,
});

let service: StudentResultsService;

beforeEach(() => {
  jest.clearAllMocks();
  service = new StudentResultsService();
});


describe("StudentResultsService.getStudentHistory", () => {
  test("returns mapped history for a student", async () => {
    mockQuizResultRepo.findByStudent.mockResolvedValue([makeResult()]);

    const history = await service.getStudentHistory("student1");

    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({
      resultId: "result1",
      totalQuestions: 10,
      correctAnswers: 7,
      wrongAnswers: 3,
      accuracy: 70,
    });
    expect(history[0].quiz.subject).toBe("Maths");
  });

  test("returns empty array when student has no results", async () => {
    mockQuizResultRepo.findByStudent.mockResolvedValue([]);

    const history = await service.getStudentHistory("student1");

    expect(history).toEqual([]);
  });

  test("filters out results where quizId is null", async () => {
    mockQuizResultRepo.findByStudent.mockResolvedValue([
      makeResult(),
      makeResult({ quizId: null }),
    ]);

    const history = await service.getStudentHistory("student1");

    expect(history).toHaveLength(1);
  });

  test("calculates accuracy correctly", async () => {
    mockQuizResultRepo.findByStudent.mockResolvedValue([
      makeResult({ correctAnswers: 3, totalQuestions: 4 }),
    ]);

    const history = await service.getStudentHistory("student1");

    expect(history[0].accuracy).toBe(75);
  });

  test("accuracy is 0 when totalQuestions is 0", async () => {
    mockQuizResultRepo.findByStudent.mockResolvedValue([
      makeResult({ correctAnswers: 0, totalQuestions: 0 }),
    ]);

    const history = await service.getStudentHistory("student1");

    expect(history[0].accuracy).toBe(0);
  });

  test("calls findByStudent with correct studentId", async () => {
    mockQuizResultRepo.findByStudent.mockResolvedValue([]);

    await service.getStudentHistory("student42");

    expect(mockQuizResultRepo.findByStudent).toHaveBeenCalledWith("student42");
  });
});


describe("StudentResultsService.getStudentResultDetail", () => {
  test("returns full result detail with populated quiz", async () => {
    const mockPopulated = {
      populate: jest.fn().mockResolvedValue({
        _id: { toString: () => "result1" },
        quizId: {
          _id: { toString: () => "quiz1" },
          subject: "Science",
          classLevel: 9,
          startTime: new Date("2024-02-01"),
          endTime: new Date("2024-02-02"),
        },
        totalQuestions: 8,
        correctAnswers: 6,
        wrongAnswers: 2,
        timeTaken: 80,
        aiFeedback: "Excellent!",
        questionStats: [
          { questionId: { toString: () => "q1" }, correct: true, timeTaken: 10 },
        ],
        createdAt: new Date(),
      }),
    };
    mockQuizResultRepo.findByStudentAndQuiz.mockResolvedValue(mockPopulated);

    const result = await service.getStudentResultDetail("student1", "quiz1");

    expect(result.resultId).toBe("result1");
    expect(result.quiz.subject).toBe("Science");
    expect(result.correctAnswers).toBe(6);
    expect(result.aiFeedback).toBe("Excellent!");
    expect(result.questionStats).toHaveLength(1);
    expect(result.accuracy).toBe(75);
  });

  test("throws 'Result not found' when no result exists", async () => {
    mockQuizResultRepo.findByStudentAndQuiz.mockResolvedValue(null);

    await expect(
      service.getStudentResultDetail("student1", "quiz1")
    ).rejects.toThrow("Result not found");
  });

  test("defaults aiFeedback to 'No feedback available.' when null", async () => {
    const mockPopulated = {
      populate: jest.fn().mockResolvedValue({
        _id: { toString: () => "result1" },
        quizId: { _id: { toString: () => "quiz1" }, subject: "Maths", classLevel: 10, startTime: null, endTime: null },
        totalQuestions: 5,
        correctAnswers: 5,
        wrongAnswers: 0,
        timeTaken: 50,
        aiFeedback: null,
        questionStats: null,
        createdAt: new Date(),
      }),
    };
    mockQuizResultRepo.findByStudentAndQuiz.mockResolvedValue(mockPopulated);

    const result = await service.getStudentResultDetail("student1", "quiz1");

    expect(result.aiFeedback).toBe("No feedback available.");
    expect(result.questionStats).toEqual([]);
  });

  test("calls findByStudentAndQuiz with correct args", async () => {
    mockQuizResultRepo.findByStudentAndQuiz.mockResolvedValue(null);

    await expect(service.getStudentResultDetail("stu99", "qz88")).rejects.toThrow();

    expect(mockQuizResultRepo.findByStudentAndQuiz).toHaveBeenCalledWith("stu99", "qz88");
  });
});

describe("StudentResultsService.getPerformanceGraph", () => {
  test("groups results by subject", async () => {
    mockQuizResultRepo.findByStudent.mockResolvedValue([
      makeResult({ quizId: { _id: { toString: () => "q1" }, subject: "Maths", classLevel: 10, startTime: null, endTime: null }, correctAnswers: 8, totalQuestions: 10, createdAt: new Date("2024-01-01") }),
      makeResult({ quizId: { _id: { toString: () => "q2" }, subject: "Science", classLevel: 10, startTime: null, endTime: null }, correctAnswers: 6, totalQuestions: 10, createdAt: new Date("2024-01-02") }),
    ]);

    const graph = await service.getPerformanceGraph("student1");

    expect(graph).toHaveProperty("Maths");
    expect(graph).toHaveProperty("Science");
    expect(graph["Maths"]).toHaveLength(1);
    expect(graph["Science"]).toHaveLength(1);
  });

  test("sorts each subject's data by date ascending", async () => {
    const older = new Date("2024-01-01");
    const newer = new Date("2024-01-10");

    mockQuizResultRepo.findByStudent.mockResolvedValue([
      makeResult({ quizId: { _id: { toString: () => "q2" }, subject: "Maths", classLevel: 10, startTime: null, endTime: null }, createdAt: newer }),
      makeResult({ quizId: { _id: { toString: () => "q1" }, subject: "Maths", classLevel: 10, startTime: null, endTime: null }, createdAt: older }),
    ]);

    const graph = await service.getPerformanceGraph("student1");

    expect(graph["Maths"][0].date).toEqual(older);
    expect(graph["Maths"][1].date).toEqual(newer);
  });

  test("skips results where quizId is null", async () => {
    mockQuizResultRepo.findByStudent.mockResolvedValue([
      makeResult(),
      makeResult({ quizId: null }),
    ]);

    const graph = await service.getPerformanceGraph("student1");

    const total = Object.values(graph).flat().length;
    expect(total).toBe(1);
  });

  test("returns empty object when student has no results", async () => {
    mockQuizResultRepo.findByStudent.mockResolvedValue([]);

    const graph = await service.getPerformanceGraph("student1");

    expect(graph).toEqual({});
  });

  test("calculates accuracy per data point", async () => {
    mockQuizResultRepo.findByStudent.mockResolvedValue([
      makeResult({ correctAnswers: 3, totalQuestions: 4 }),
    ]);

    const graph = await service.getPerformanceGraph("student1");

    expect(graph["Maths"][0].accuracy).toBe(75);
  });
});