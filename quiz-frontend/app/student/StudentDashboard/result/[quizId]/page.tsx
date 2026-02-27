"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ResultAPI } from "@/lib/api/result-api";

interface ResultDetail {
  resultId: string;
  quiz: {
    id: string;
    subject: string;
    classLevel: number;
    startTime: string | null;
    endTime: string | null;
  };
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  timeTaken: number;
  aiFeedback: string;
  questionStats: {
    questionId: string;
    correct: boolean;
    timeTaken: number;
  }[];
  completedAt: string;
}

export default function StudentResultDetailPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId as string;

  const [result, setResult] = useState<ResultDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await ResultAPI.getMyResultDetail(quizId);
        setResult(data);
      } catch {
        setError("Failed to load result.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [quizId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-black" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error ?? "Result not found."}</p>
      </div>
    );
  }

  const correctCount = result.questionStats.filter((q) => q.correct).length;
  const wrongCount = result.questionStats.filter((q) => !q.correct).length;

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-black flex items-center gap-1 transition"
        >
          ← Back to Results
        </button>

        {/* Quiz Info */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {result.quiz.subject}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Class {result.quiz.classLevel}
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Completed{" "}
              {new Date(result.completedAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-xs text-gray-500 uppercase mb-1">Score</p>
            <p className="text-2xl font-bold text-gray-900">
              {result.correctAnswers}/{result.totalQuestions}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-xs text-gray-500 uppercase mb-1">Accuracy</p>
            <p className={`text-2xl font-bold ${
              result.accuracy >= 80 ? "text-green-600"
              : result.accuracy >= 50 ? "text-yellow-600"
              : "text-red-500"
            }`}>
              {result.accuracy}%
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-xs text-gray-500 uppercase mb-1">Time Taken</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatTime(result.timeTaken)}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-xs text-gray-500 uppercase mb-1">Wrong</p>
            <p className="text-2xl font-bold text-red-500">
              {result.wrongAnswers}
            </p>
          </div>
        </div>

        {/* Performance Bar */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Performance Overview
          </h2>
          <div className="flex rounded-full overflow-hidden h-4 mb-3">
            <div
              className="bg-green-400 transition-all"
              style={{ width: `${(correctCount / result.totalQuestions) * 100}%` }}
            />
            <div
              className="bg-red-400 transition-all"
              style={{ width: `${(wrongCount / result.totalQuestions) * 100}%` }}
            />
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
              {correctCount} Correct
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
              {wrongCount} Wrong
            </span>
          </div>
        </div>

        {/* AI Feedback */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            🤖 AI Feedback
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {result.aiFeedback}
          </p>
        </div>

      </div>
    </div>
  );
}