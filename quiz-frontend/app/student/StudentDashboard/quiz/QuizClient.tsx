"use client";

import { useEffect, useState } from "react";
import { QuizAPI } from "@/lib/api/quiz-api";

interface Props {
  quizId: string;
  subject: string;
  endTime: string;
}

export default function QuizClient({ quizId, subject, endTime }: Props) {
  const [question, setQuestion] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [progress, setProgress] = useState<{ answered: number; total: number } | null>(null);

  // ── TIMER ─────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft("00:00");
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setTimeLeft(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  // ── LOAD QUESTION ─────────────────────────────
  useEffect(() => {
    loadNextQuestion();
  }, []);

  const loadNextQuestion = async () => {
    setIsEvaluating(true);

    const res = await QuizAPI.nextQuestion(quizId);

    if (res.done) {
      setResult(res);
      setQuestion(null);
      setProgress(null);
      setIsEvaluating(false);
      return;
    }

    setQuestion(res.question);

    if (res.question?.progress) {
      setProgress(res.question.progress);
    }

    setIsEvaluating(false);
  };

  // ── SUBMIT ANSWER ─────────────────────────────
  const submitAnswer = async (selectedOption: string) => {
    if (!question) return;

    await QuizAPI.submitAnswer(
      quizId,
      question._id,
      selectedOption,
      10
    );

    loadNextQuestion();
  };

  // ───────────────────────────────────────────────
  // RESULT SCREEN
  // ───────────────────────────────────────────────
  if (result) {
    const accuracy =
      result.totalQuestions > 0
        ? ((result.correctAnswers / result.totalQuestions) * 100).toFixed(1)
        : 0;

    const totalSeconds = result.timeTakenSeconds ?? 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Quiz Completed
          </h1>

          <div className="space-y-2 text-gray-700 text-center">
            <p>
              Score: <strong>{result.correctAnswers}</strong> /{" "}
              {result.totalQuestions}
            </p>
            <p>Accuracy: <strong>{accuracy}%</strong></p>
            <p>
              Time Taken: <strong>{minutes}m {seconds}s</strong>
            </p>
          </div>

          <div className="mt-6 bg-gray-100 rounded-xl p-4 text-gray-800">
            <h3 className="font-semibold mb-2">AI Feedback</h3>
            <p className="text-sm sm:text-base">{result.aiFeedback}</p>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────
  // AI EVALUATING SCREEN
  // ───────────────────────────────────────────────
  if (isEvaluating) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-6">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-black border-solid mb-6"></div>
        <h2 className="text-xl font-semibold mb-2">
          Analyzing Your Performance...
        </h2>
        <p className="text-gray-600 max-w-sm">
          Please wait while we generate personalized feedback.
        </p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading next question...
      </div>
    );
  }

  const questionsLeft =
    progress ? progress.total - progress.answered : null;

  // ───────────────────────────────────────────────
  // MAIN QUIZ SCREEN
  // ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 sm:p-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">
            {subject}
          </h2>

          <div className="text-sm sm:text-base font-semibold border px-4 py-2 rounded-lg">
            ⏳ {timeLeft}
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 text-sm text-gray-600 mb-6">
          <span>Difficulty: {question.difficulty}</span>

          {questionsLeft !== null && (
            <span>Questions Left: {questionsLeft}</span>
          )}
        </div>

        {/* Question */}
        <h3 className="text-lg sm:text-xl font-medium mb-6">
          {question.text}
        </h3>

        {/* Options */}
        <div className="space-y-4">
          {question.options.map((option: any, index: number) => (
            <button
              key={index}
              onClick={() => submitAnswer(option.key)}
              className="w-full border rounded-xl p-4 text-left hover:bg-gray-100 transition text-sm sm:text-base"
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
