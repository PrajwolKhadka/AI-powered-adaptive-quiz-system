"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ResultAPI } from "@/lib/api/result-api";

interface StudentResult {
  resultId: string;
  student: {
    id: string;
    fullName: string;
    email: string;
    className: number;
  };
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
  completedAt: string;
}

export default function QuizResultsPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId as string;

  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await ResultAPI.getQuizResults(quizId);
        setResults(data);
      } catch {
        setError("Failed to load results.");
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

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "text-green-600";
    if (accuracy >= 50) return "text-yellow-600";
    return "text-red-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-black" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const quiz = results[0]?.quiz;

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-black mb-6 flex items-center gap-1 transition"
        >
          ← Back to Quizzes
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {quiz
              ? `${quiz.subject} — Class ${quiz.classLevel}`
              : "Quiz Results"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {results.length} student{results.length !== 1 ? "s" : ""} completed
            this quiz
          </p>
        </div>

        {/* Summary Cards */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow p-5">
              <p className="text-xs text-gray-500 uppercase mb-1">
                Avg Accuracy
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {(
                  results.reduce((sum, r) => sum + r.accuracy, 0) /
                  results.length
                ).toFixed(1)}
                %
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-5">
              <p className="text-xs text-gray-500 uppercase mb-1">Avg Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {(
                  results.reduce((sum, r) => sum + r.correctAnswers, 0) /
                  results.length
                ).toFixed(1)}{" "}
                / {results[0].totalQuestions}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-5">
              <p className="text-xs text-gray-500 uppercase mb-1">Avg Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(
                  Math.round(
                    results.reduce((sum, r) => sum + r.timeTaken, 0) /
                      results.length,
                  ),
                )}
              </p>
            </div>
          </div>
        )}

        {results.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-400">
            No students have completed this quiz yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="text-left px-6 py-4">Student</th>
                  <th className="text-left px-6 py-4">Class</th>
                  <th className="text-left px-6 py-4">Score</th>
                  <th className="text-left px-6 py-4">Accuracy</th>
                  <th className="text-left px-6 py-4">Time Taken</th>
                  <th className="text-left px-6 py-4">Completed</th>
                  <th className="text-left px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map((r) => (
                  <tr
                    key={r.resultId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {r.student.fullName}
                      </p>
                      <p className="text-xs text-gray-400">{r.student.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      Class {r.student.className}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {r.correctAnswers} / {r.totalQuestions}
                    </td>
                    <td
                      className={`px-6 py-4 font-semibold ${getAccuracyColor(r.accuracy)}`}
                    >
                      {r.accuracy}%
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatTime(r.timeTaken)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(r.completedAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          router.push(
                            `/school/results/${quizId}/${r.student.id}`,
                          )
                        }
                        className="text-sm font-medium text-black underline underline-offset-2 hover:opacity-70 transition"
                      >
                        View Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
