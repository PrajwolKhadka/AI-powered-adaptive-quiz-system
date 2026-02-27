import { QuizService } from "../../services/quiz.services";

jest.mock("../../models/quiz.model");
jest.mock("../../models/questions.model");

import { QuizModel } from "../../models/quiz.model";
import { QuestionModel } from "../../models/questions.model";


const makeToggleInput = (overrides = {}) => ({
  classLevel: 10,
  subject: "Maths" as const,
  durationMinutes: 30,
  isActive: true,
  ...overrides,
});

const schoolId = "school123";

beforeEach(() => {
  jest.clearAllMocks();
});


describe("QuizService.toggleQuiz — create new quiz", () => {
  test("creates a new quiz when no quizId provided", async () => {
    const mockQuestions = [
      { _id: "q1" },
      { _id: "q2" },
    ];
    (QuestionModel.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockQuestions),
    });

    const createdQuiz = {
      _id: "newQuiz",
      isActive: true,
      subject: "Maths",
      classLevel: 10,
      durationMinutes: 30,
      startTime: expect.any(Date),
      endTime: expect.any(Date),
    };
    (QuizModel.create as jest.Mock).mockResolvedValue(createdQuiz);

    const result = await QuizService.toggleQuiz(schoolId, makeToggleInput());

    expect(QuizModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        schoolId,
        subject: "Maths",
        classLevel: 10,
        durationMinutes: 30,
        isActive: true,
        questionIds: ["q1", "q2"],
      })
    );
    expect(result).toEqual(createdQuiz);
  });

  test("sets startTime and endTime when isActive is true", async () => {
    (QuestionModel.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue([]),
    });
    (QuizModel.create as jest.Mock).mockImplementation(async (data: any) => data);

    const before = new Date();
    const result: any = await QuizService.toggleQuiz(schoolId, makeToggleInput({ isActive: true }));
    const after = new Date();

    expect(result.startTime).toBeInstanceOf(Date);
    expect(result.endTime).toBeInstanceOf(Date);
    expect(result.startTime.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(result.endTime.getTime()).toBeGreaterThan(result.startTime.getTime());
  });

  test("sets startTime and endTime to null when isActive is false", async () => {
    (QuestionModel.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue([]),
    });
    (QuizModel.create as jest.Mock).mockImplementation(async (data: any) => data);

    const result: any = await QuizService.toggleQuiz(
      schoolId,
      makeToggleInput({ isActive: false })
    );

    expect(result.startTime).toBeNull();
    expect(result.endTime).toBeNull();
  });

  test("endTime is exactly durationMinutes after startTime", async () => {
    (QuestionModel.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue([]),
    });
    (QuizModel.create as jest.Mock).mockImplementation(async (data: any) => data);

    const result: any = await QuizService.toggleQuiz(
      schoolId,
      makeToggleInput({ durationMinutes: 45 })
    );

    const diffMinutes =
      (result.endTime.getTime() - result.startTime.getTime()) / 60000;

    expect(diffMinutes).toBeCloseTo(45, 0);
  });

  test("fetches questions filtered by schoolId and subject", async () => {
    const selectMock = jest.fn().mockResolvedValue([]);
    (QuestionModel.find as jest.Mock).mockReturnValue({ select: selectMock });
    (QuizModel.create as jest.Mock).mockResolvedValue({});

    await QuizService.toggleQuiz(schoolId, makeToggleInput({ subject: "Science" }));

    expect(QuestionModel.find).toHaveBeenCalledWith({
      schoolId,
      subject: "Science",
    });
  });
});

describe("QuizService.toggleQuiz — update existing quiz", () => {
  test("updates quiz when quizId is provided", async () => {
    const updatedQuiz = { _id: "quiz1", isActive: false };
    (QuizModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedQuiz);

    const result = await QuizService.toggleQuiz(
      schoolId,
      makeToggleInput({ quizId: "quiz1", isActive: false })
    );

    expect(QuizModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "quiz1", schoolId },
      expect.objectContaining({ isActive: false }),
      { new: true }
    );
    expect(result).toEqual(updatedQuiz);
  });

  test("throws 'Quiz not found' when quizId does not match school", async () => {
    (QuizModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(
      QuizService.toggleQuiz(schoolId, makeToggleInput({ quizId: "wrongId" }))
    ).rejects.toThrow("Quiz not found");
  });

  test("does not call QuestionModel.find when quizId is provided", async () => {
    (QuizModel.findOneAndUpdate as jest.Mock).mockResolvedValue({ _id: "quiz1" });

    await QuizService.toggleQuiz(
      schoolId,
      makeToggleInput({ quizId: "quiz1" })
    );

    expect(QuestionModel.find).not.toHaveBeenCalled();
  });

  test("updates classLevel and durationMinutes correctly", async () => {
    (QuizModel.findOneAndUpdate as jest.Mock).mockResolvedValue({ _id: "quiz1" });

    await QuizService.toggleQuiz(
      schoolId,
      makeToggleInput({ quizId: "quiz1", classLevel: 8, durationMinutes: 20 })
    );

    expect(QuizModel.findOneAndUpdate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ classLevel: 8, durationMinutes: 20 }),
      expect.anything()
    );
  });

  test("passes { new: true } to get updated document back", async () => {
    (QuizModel.findOneAndUpdate as jest.Mock).mockResolvedValue({ _id: "quiz1" });

    await QuizService.toggleQuiz(
      schoolId,
      makeToggleInput({ quizId: "quiz1" })
    );

    expect(QuizModel.findOneAndUpdate).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      { new: true }
    );
  });
});