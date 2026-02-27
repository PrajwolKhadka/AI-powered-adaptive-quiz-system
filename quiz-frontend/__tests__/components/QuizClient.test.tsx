import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuizClient from "@/app/quiz/QuizClient";

const mockNextQuestion = jest.fn();
const mockSubmitAnswer = jest.fn();

jest.mock("@/lib/api/quiz-api", () => ({
  QuizAPI: {
    nextQuestion: (...args: any[]) => mockNextQuestion(...args),
    submitAnswer: (...args: any[]) => mockSubmitAnswer(...args),
  },
}));


const user = userEvent.setup();

const FUTURE_END_TIME = new Date(Date.now() + 30 * 60 * 1000).toISOString();
const PAST_END_TIME = new Date(Date.now() - 1000).toISOString();

const makeQuestion = (overrides = {}) => ({
  _id: "q1",
  text: "What is 2 + 2?",
  difficulty: "EASY",
  options: [
    { key: "a", text: "1" },
    { key: "b", text: "2" },
    { key: "c", text: "4" },
    { key: "d", text: "5" },
  ],
  progress: { answered: 0, total: 5 },
  ...overrides,
});

const defaultProps = {
  quizId: "quiz123",
  subject: "Maths",
  endTime: FUTURE_END_TIME,
};

beforeEach(() => {
  jest.clearAllMocks();
  mockNextQuestion.mockResolvedValue({ question: makeQuestion() });
  mockSubmitAnswer.mockResolvedValue({ correct: true });
});


describe("QuizClient", () => {
  test("renders subject, question text and all 4 options", async () => {
    render(<QuizClient {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText("Maths")).toBeInTheDocument();
      expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
    });
  });

  test("renders difficulty and questions left", async () => {
    mockNextQuestion.mockResolvedValue({
      question: makeQuestion({ progress: { answered: 1, total: 5 } }),
    });
    render(<QuizClient {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText(/difficulty: easy/i)).toBeInTheDocument();
      expect(screen.getByText(/questions left: 4/i)).toBeInTheDocument();
    });
  });

  test("calls submitAnswer with correct args when option is clicked", async () => {
    render(<QuizClient {...defaultProps} />);
    await waitFor(() => screen.getByText("What is 2 + 2?"));
    await user.click(screen.getByRole("button", { name: "4" }));
    await waitFor(() => {
      expect(mockSubmitAnswer).toHaveBeenCalledWith("quiz123", "q1", "c", expect.any(Number));
    });
  });

  test("loads next question after answer is submitted", async () => {
    const second = makeQuestion({ _id: "q2", text: "What is 5 x 5?" });
    mockNextQuestion
      .mockResolvedValueOnce({ question: makeQuestion() })
      .mockResolvedValueOnce({ question: second });

    render(<QuizClient {...defaultProps} />);
    await waitFor(() => screen.getByText("What is 2 + 2?"));
    await user.click(screen.getByRole("button", { name: "4" }));
    await waitFor(() => {
      expect(screen.getByText("What is 5 x 5?")).toBeInTheDocument();
    });
  });

  test("does not call submitAnswer more than once per question", async () => {
    render(<QuizClient {...defaultProps} />);
    await waitFor(() => screen.getByText("What is 2 + 2?"));
    await user.click(screen.getByRole("button", { name: "4" }));

    await waitFor(() => expect(mockSubmitAnswer).toHaveBeenCalledTimes(1));

    expect(mockSubmitAnswer).toHaveBeenCalledTimes(1);
  });

  test("shows result screen with score and accuracy when quiz is done", async () => {
    mockNextQuestion.mockResolvedValue({
      done: true,
      totalQuestions: 5,
      correctAnswers: 4,
      wrongAnswers: 1,
      timeTakenSeconds: 90,
      aiFeedback: "Great job!",
    });
    render(<QuizClient {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText(/quiz completed/i)).toBeInTheDocument();
      expect(screen.getByText(/80.0%/i)).toBeInTheDocument();
    });
  });

  test("shows AI feedback on result screen", async () => {
    mockNextQuestion.mockResolvedValue({
      done: true,
      totalQuestions: 5,
      correctAnswers: 4,
      wrongAnswers: 1,
      timeTakenSeconds: 90,
      aiFeedback: "Keep practicing!",
    });
    render(<QuizClient {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText("Keep practicing!")).toBeInTheDocument();
    });
  });

  test("shows time taken in minutes and seconds on result screen", async () => {
    mockNextQuestion.mockResolvedValue({
      done: true,
      totalQuestions: 5,
      correctAnswers: 3,
      wrongAnswers: 2,
      timeTakenSeconds: 90,
      aiFeedback: "",
    });
    render(<QuizClient {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText(/1m 30s/i)).toBeInTheDocument();
    });
  });

  test("shows loading spinner while fetching question", () => {
    mockNextQuestion.mockImplementation(() => new Promise(() => {}));
    render(<QuizClient {...defaultProps} />);
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  test("shows timer in MM:SS format", async () => {
    render(<QuizClient {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument();
    });
  });

});