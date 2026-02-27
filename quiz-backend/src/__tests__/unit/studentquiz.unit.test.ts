import { StudentQuizService } from "../../services/studentQuiz.services";


jest.mock("../../repositories/studentAnswer.repository");
jest.mock("../../repositories/quiz.repository");
jest.mock("../../repositories/question.repository");
jest.mock("../../models/quiz.model");
jest.mock("../../models/quizResult.model");
jest.mock("../../services/aiFeedback.service");

import { StudentAnswerRepository } from "../../repositories/studentAnswer.repository";
import { QuizRepository } from "../../repositories/quiz.repository";
import { QuestionRepository } from "../../repositories/question.repository";
import { QuizModel } from "../../models/quiz.model";

const mockStudentAnswerRepo = {
  hasAnswered: jest.fn(),
  create: jest.fn(),
  getQuizQuestionPool: jest.fn(),
  setQuizQuestionPool: jest.fn(),
  getAnsweredQuestionIds: jest.fn(),
  findByStudentAndQuiz: jest.fn(),
};

const mockQuizRepo = {
  findByIdWithQuestions: jest.fn(),
  updateById: jest.fn(),
};

(StudentAnswerRepository as jest.Mock).mockImplementation(
  () => mockStudentAnswerRepo
);
(QuizRepository as jest.Mock).mockImplementation(() => mockQuizRepo);

const mockQuestionRepo = QuestionRepository as jest.Mocked<typeof QuestionRepository>;


const makeQuestion = (overrides = {}) => ({
  _id: { toString: () => "q1" },
  question: "What is 2+2?",
  options: { a: "1", b: "2", c: "4", d: "5" },
  correctAnswer: "c",
  subject: "Maths",
  difficulty: "EASY",
  toObject: function () { return { ...this }; },
  ...overrides,
});

const makeQuiz = (overrides = {}) => ({
  _id: { toString: () => "quiz1" },
  isActive: true,
  startTime: new Date(Date.now() - 5000),
  endTime: new Date(Date.now() + 30 * 60 * 1000),
  questionIds: [makeQuestion()],
  ...overrides,
});

let service: StudentQuizService;

beforeEach(() => {
  jest.clearAllMocks();
  service = new StudentQuizService();
});

describe("StudentQuizService.submitAnswer", () => {
  const dto = {
    quizId: "quiz1",
    questionId: "q1",
    selectedOption: "c" as const,
    timeTaken: 8,
  };

  test("returns correct: true when selected option matches correctAnswer", async () => {
    (mockQuestionRepo.findById as jest.Mock).mockResolvedValue(makeQuestion({ correctAnswer: "c" }));
    mockStudentAnswerRepo.hasAnswered.mockResolvedValue(false);
    mockStudentAnswerRepo.create.mockResolvedValue({});

    const result = await service.submitAnswer("student1", dto);

    expect(result.correct).toBe(true);
    expect(mockStudentAnswerRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ correct: true })
    );
  });

  test("returns correct: false when selected option is wrong", async () => {
    (mockQuestionRepo.findById as jest.Mock).mockResolvedValue(makeQuestion({ correctAnswer: "b" }));
    mockStudentAnswerRepo.hasAnswered.mockResolvedValue(false);
    mockStudentAnswerRepo.create.mockResolvedValue({});

    const result = await service.submitAnswer("student1", {
      ...dto,
      selectedOption: "a",
    });

    expect(result.correct).toBe(false);
  });

  test("throws 'Question not found' when question does not exist", async () => {
    (mockQuestionRepo.findById as jest.Mock).mockResolvedValue(null);

    await expect(service.submitAnswer("student1", dto)).rejects.toThrow(
      "Question not found"
    );
  });

  test("throws 'Question already answered' when student already answered", async () => {
    (mockQuestionRepo.findById as jest.Mock).mockResolvedValue(makeQuestion());
    mockStudentAnswerRepo.hasAnswered.mockResolvedValue(true);

    await expect(service.submitAnswer("student1", dto)).rejects.toThrow(
      "Question already answered"
    );
  });

  test("saves answer with correct subject and difficulty", async () => {
    (mockQuestionRepo.findById as jest.Mock).mockResolvedValue(
      makeQuestion({ subject: "Science", difficulty: "HARD", correctAnswer: "c" })
    );
    mockStudentAnswerRepo.hasAnswered.mockResolvedValue(false);
    mockStudentAnswerRepo.create.mockResolvedValue({});

    await service.submitAnswer("student1", dto);

    expect(mockStudentAnswerRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "Science",
        difficulty: 1, 
        timeTaken: 8,
      })
    );
  });

  test("saves studentId, quizId and questionId correctly", async () => {
    (mockQuestionRepo.findById as jest.Mock).mockResolvedValue(makeQuestion({ correctAnswer: "c" }));
    mockStudentAnswerRepo.hasAnswered.mockResolvedValue(false);
    mockStudentAnswerRepo.create.mockResolvedValue({});

    await service.submitAnswer("student42", dto);

    expect(mockStudentAnswerRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        studentId: "student42",
        quizId: "quiz1",
        questionId: "q1",
      })
    );
  });
});


describe("StudentQuizService.getActiveQuizForStudent", () => {
  test("returns active quiz for matching classLevel", async () => {
    const mockQuiz = { _id: "quiz1", classLevel: 10, isActive: true };
    (QuizModel.findOne as jest.Mock).mockResolvedValue(mockQuiz);

    const result = await service.getActiveQuizForStudent(10);

    expect(result).toEqual(mockQuiz);
    expect(QuizModel.findOne).toHaveBeenCalledWith(
      expect.objectContaining({ classLevel: 10, isActive: true })
    );
  });

  test("returns null when no active quiz for classLevel", async () => {
    (QuizModel.findOne as jest.Mock).mockResolvedValue(null);

    const result = await service.getActiveQuizForStudent(11);

    expect(result).toBeNull();
  });
});

describe("StudentQuizService.getNextQuestion", () => {
  const dto = { quizId: "quiz1" };

  test("throws 'Quiz not found' when quiz does not exist", async () => {
    mockQuizRepo.findByIdWithQuestions.mockResolvedValue(null);

    await expect(service.getNextQuestion("student1", dto)).rejects.toThrow(
      "Quiz not found"
    );
  });

  test("throws 'Quiz is not active' when quiz isActive is false", async () => {
    mockQuizRepo.findByIdWithQuestions.mockResolvedValue(
      makeQuiz({ isActive: false })
    );

    await expect(service.getNextQuestion("student1", dto)).rejects.toThrow(
      "Quiz is not active"
    );
  });

  test("throws 'Quiz has expired' when endTime is in the past", async () => {
    mockQuizRepo.findByIdWithQuestions.mockResolvedValue(
      makeQuiz({
        isActive: true,
        startTime: new Date(Date.now() - 20 * 60 * 1000),
        endTime: new Date(Date.now() - 5 * 60 * 1000), // expired
      })
    );
    mockQuizRepo.updateById.mockResolvedValue({});

    await expect(service.getNextQuestion("student1", dto)).rejects.toThrow(
      "Quiz has expired"
    );
  });

  test("sets isActive: false on the quiz when it has expired", async () => {
    mockQuizRepo.findByIdWithQuestions.mockResolvedValue(
      makeQuiz({
        isActive: true,
        startTime: new Date(Date.now() - 20 * 60 * 1000),
        endTime: new Date(Date.now() - 1000),
      })
    );
    mockQuizRepo.updateById.mockResolvedValue({});

    await expect(service.getNextQuestion("student1", dto)).rejects.toThrow(
      "Quiz has expired"
    );

    expect(mockQuizRepo.updateById).toHaveBeenCalledWith("quiz1", {
      isActive: false,
    });
  });

  test("returns a question on first call (creates new pool)", async () => {
    const q1 = makeQuestion({ _id: { toString: () => "q1" } });
    const q2 = makeQuestion({ _id: { toString: () => "q2" }, questionNumber: 2 });
    mockQuizRepo.findByIdWithQuestions.mockResolvedValue(
      makeQuiz({ questionIds: [q1, q2] })
    );
    mockStudentAnswerRepo.getQuizQuestionPool.mockResolvedValue(null); 
    mockStudentAnswerRepo.setQuizQuestionPool.mockResolvedValue({});
    mockStudentAnswerRepo.getAnsweredQuestionIds.mockResolvedValue([]);
    mockStudentAnswerRepo.findByStudentAndQuiz.mockResolvedValue([]);

    const result = await service.getNextQuestion("student1", dto);

    expect(result).toHaveProperty("question");
    expect(result.question).toHaveProperty("_id");
    expect(result.question).toHaveProperty("text");
    expect(result.question).toHaveProperty("options");
    expect(result.question).toHaveProperty("progress");
    expect(result.question).not.toHaveProperty("correctAnswer");
  });

  test("progress.answered reflects number of answered questions", async () => {
    const q1 = makeQuestion({ _id: { toString: () => "q1" } });
    const q2 = makeQuestion({ _id: { toString: () => "q2" }, questionNumber: 2 });
    mockQuizRepo.findByIdWithQuestions.mockResolvedValue(
      makeQuiz({ questionIds: [q1, q2] })
    );
    mockStudentAnswerRepo.getQuizQuestionPool.mockResolvedValue(["q1", "q2"]);
    mockStudentAnswerRepo.getAnsweredQuestionIds.mockResolvedValue(["q1"]);
    mockStudentAnswerRepo.findByStudentAndQuiz.mockResolvedValue([
      { questionId: { toString: () => "q1" }, correct: true, timeTaken: 5, subject: "Maths", difficulty: -1 },
    ]);

    const result = await service.getNextQuestion("student1", dto);

    expect(result.question!.progress.answered).toBe(1);
  });
});