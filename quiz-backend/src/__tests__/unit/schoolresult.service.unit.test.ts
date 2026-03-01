import { SchoolResultsService } from "../../services/schoolresults.service";

jest.mock("../../repositories/quizresult.repository");
jest.mock("../../models/quiz.model");

import { QuizResultRepository } from "../../repositories/quizresult.repository";
import { QuizModel } from "../../models/quiz.model";

const mockQuizResultRepo = {
  findByQuiz: jest.fn(),
  findByStudentAndQuiz: jest.fn(),
  findByQuizIds: jest.fn(),
};

(QuizResultRepository as jest.Mock).mockImplementation(() => mockQuizResultRepo);

const makeQuiz = (overrides = {}): any => ({
  _id: { toString: () => "quiz1" },
  subject: "Maths",
  classLevel: 10,
  isActive: true,
  startTime: new Date("2024-01-01"),
  endTime: new Date("2024-01-02"),
  questionIds: [{ _id: "q1" }, { _id: "q2" }],
  createdAt: new Date("2024-01-01"),
  ...overrides,
});

const makeResult = (overrides = {}): any => ({
  _id: { toString: () => "result1" },
  studentId: {
    _id: { toString: () => "student1" },
    fullName: "Test Student",
    email: "student@test.com",
    className: "10",
  },
  quizId: { _id: { toString: () => "quiz1" }, subject: "Maths", classLevel: 10, startTime: new Date(), endTime: new Date() },
  totalQuestions: 10,
  correctAnswers: 7,
  wrongAnswers: 3,
  timeTaken: 120,
  aiFeedback: "Good job!",
  questionStats: [],
  createdAt: new Date("2024-01-02"),
  ...overrides,
});

let service: SchoolResultsService;

beforeEach(() => {
  jest.clearAllMocks();
  service = new SchoolResultsService();
});


describe("SchoolResultsService.getSchoolQuizzes", () => {
  test("returns mapped quiz list for school", async () => {
    const quiz = makeQuiz();
    (QuizModel.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue([quiz]),
    });

    const result = await service.getSchoolQuizzes("school1");

    expect(QuizModel.find).toHaveBeenCalledWith({ schoolId: "school1" });
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "quiz1",
      subject: "Maths",
      classLevel: 10,
      isActive: true,
      totalQuestions: 2,
    });
  });

  test("returns empty array when school has no quizzes", async () => {
    (QuizModel.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    const result = await service.getSchoolQuizzes("school1");

    expect(result).toEqual([]);
  });

  test("handles quiz with no questionIds (defaults to 0)", async () => {
    const quiz = makeQuiz({ questionIds: undefined });
    (QuizModel.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue([quiz]),
    });

    const result = await service.getSchoolQuizzes("school1");

    expect(result[0].totalQuestions).toBe(0);
  });

  test("sorts quizzes by createdAt descending", async () => {
    const sortMock = jest.fn().mockResolvedValue([makeQuiz()]);
    (QuizModel.find as jest.Mock).mockReturnValue({ sort: sortMock });

    await service.getSchoolQuizzes("school1");

    expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
  });
});


describe("SchoolResultsService.getResultsByQuiz", () => {
  test("returns mapped results for a valid quiz", async () => {
    (QuizModel.findOne as jest.Mock).mockResolvedValue(makeQuiz());
    mockQuizResultRepo.findByQuiz.mockResolvedValue([makeResult()]);

    const results = await service.getResultsByQuiz("school1", "quiz1");

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      resultId: "result1",
      totalQuestions: 10,
      correctAnswers: 7,
      wrongAnswers: 3,
      accuracy: 70,
    });
  });

  test("throws 'Quiz not found or access denied' when quiz not found", async () => {
    (QuizModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.getResultsByQuiz("school1", "badQuiz")).rejects.toThrow(
      "Quiz not found or access denied"
    );
  });

  test("returns empty array when no results exist for quiz", async () => {
    (QuizModel.findOne as jest.Mock).mockResolvedValue(makeQuiz());
    mockQuizResultRepo.findByQuiz.mockResolvedValue([]);

    const results = await service.getResultsByQuiz("school1", "quiz1");

    expect(results).toEqual([]);
  });

  test("calculates accuracy correctly", async () => {
    (QuizModel.findOne as jest.Mock).mockResolvedValue(makeQuiz());
    mockQuizResultRepo.findByQuiz.mockResolvedValue([
      makeResult({ correctAnswers: 5, totalQuestions: 10 }),
    ]);

    const results = await service.getResultsByQuiz("school1", "quiz1");

    expect(results[0].accuracy).toBe(50);
  });

  test("accuracy is 0 when totalQuestions is 0", async () => {
    (QuizModel.findOne as jest.Mock).mockResolvedValue(makeQuiz());
    mockQuizResultRepo.findByQuiz.mockResolvedValue([
      makeResult({ correctAnswers: 0, totalQuestions: 0 }),
    ]);

    const results = await service.getResultsByQuiz("school1", "quiz1");

    expect(results[0].accuracy).toBe(0);
  });
});


describe("SchoolResultsService.getStudentResultDetail", () => {
  test("returns full result detail for a valid student and quiz", async () => {
    (QuizModel.findOne as jest.Mock).mockResolvedValue(makeQuiz());

    const mockPopulated = {
      ...makeResult(),
      populate: jest.fn().mockResolvedValue({
        _id: { toString: () => "result1" },
        studentId: {
          _id: { toString: () => "student1" },
          fullName: "Test Student",
          email: "student@test.com",
          className: "10",
        },
        totalQuestions: 10,
        correctAnswers: 8,
        wrongAnswers: 2,
        timeTaken: 90,
        aiFeedback: "Well done!",
        questionStats: [
          { questionId: { toString: () => "q1" }, correct: true, timeTaken: 5 },
        ],
        createdAt: new Date(),
      }),
    };
    mockQuizResultRepo.findByStudentAndQuiz.mockResolvedValue(mockPopulated);

    const result = await service.getStudentResultDetail("school1", "quiz1", "student1");

    expect(result.resultId).toBe("result1");
    expect(result.aiFeedback).toBe("Well done!");
    expect(result.questionStats).toHaveLength(1);
    expect(result.student.fullName).toBe("Test Student");
  });

  test("throws 'Quiz not found or access denied' when quiz not found", async () => {
    (QuizModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.getStudentResultDetail("school1", "quiz1", "student1")
    ).rejects.toThrow("Quiz not found or access denied");
  });

  test("throws 'Result not found' when no result for student+quiz", async () => {
    (QuizModel.findOne as jest.Mock).mockResolvedValue(makeQuiz());
    mockQuizResultRepo.findByStudentAndQuiz.mockResolvedValue(null);

    await expect(
      service.getStudentResultDetail("school1", "quiz1", "student1")
    ).rejects.toThrow("Result not found");
  });

  test("defaults aiFeedback to 'No feedback available.' when not present", async () => {
    (QuizModel.findOne as jest.Mock).mockResolvedValue(makeQuiz());

    const mockPopulated = {
      populate: jest.fn().mockResolvedValue({
        _id: { toString: () => "result1" },
        studentId: { _id: { toString: () => "s1" }, fullName: "A", email: "a@b.com", className: "9" },
        totalQuestions: 5,
        correctAnswers: 3,
        wrongAnswers: 2,
        timeTaken: 50,
        aiFeedback: null,
        questionStats: null,
        createdAt: new Date(),
      }),
    };
    mockQuizResultRepo.findByStudentAndQuiz.mockResolvedValue(mockPopulated);

    const result = await service.getStudentResultDetail("school1", "quiz1", "student1");

    expect(result.aiFeedback).toBe("No feedback available.");
    expect(result.questionStats).toEqual([]);
  });
});
describe("SchoolResultsService.getAllResultsForSchool", () => {
  test("returns all results across all school quizzes", async () => {
    (QuizModel.find as jest.Mock).mockResolvedValue([
      { _id: { toString: () => "quiz1" } },
      { _id: { toString: () => "quiz2" } },
    ]);
    mockQuizResultRepo.findByQuizIds.mockResolvedValue([makeResult()]);

    const results = await service.getAllResultsForSchool("school1");

    expect(QuizModel.find).toHaveBeenCalledWith({ schoolId: "school1" }, { _id: 1 });
    expect(mockQuizResultRepo.findByQuizIds).toHaveBeenCalledWith(["quiz1", "quiz2"]);
    expect(results).toHaveLength(1);
  });

  test("returns empty array when school has no quizzes", async () => {
    (QuizModel.find as jest.Mock).mockResolvedValue([]);

    const results = await service.getAllResultsForSchool("school1");

    expect(results).toEqual([]);
    expect(mockQuizResultRepo.findByQuizIds).not.toHaveBeenCalled();
  });

  test("maps result fields correctly", async () => {
    (QuizModel.find as jest.Mock).mockResolvedValue([
      { _id: { toString: () => "quiz1" } },
    ]);
    mockQuizResultRepo.findByQuizIds.mockResolvedValue([
      makeResult({ correctAnswers: 10, totalQuestions: 10 }),
    ]);

    const results = await service.getAllResultsForSchool("school1");

    expect(results[0].accuracy).toBe(100);
    expect(results[0].correctAnswers).toBe(10);
  });
});