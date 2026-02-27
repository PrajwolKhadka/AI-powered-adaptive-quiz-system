"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ResultAPI } from "@/lib/api/result-api";
import { downloadResultPDF } from "./_components/DownloadResult";

interface ResultDetail {
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
  const studentId = params.studentId as string;

  const [result, setResult] = useState<ResultDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await ResultAPI.getStudentResultDetail(quizId, studentId);
        setResult(data);
      } catch {
        setError("Failed to load result.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [quizId, studentId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const handleDownloadPDF = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      await downloadResultPDF(result);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-black" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">{error ?? "Result not found."}</p>
      </div>
    );
  }

  const correctCount = result.questionStats.filter((q) => q.correct).length;
  const wrongCount = result.questionStats.filter((q) => !q.correct).length;

  return (
    <div className="min-h-screen px-6 py-5">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-black flex items-center gap-1 transition"
          >
            ← Back to Quiz Results
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 bg-black text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-80 transition disabled:opacity-50"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Generating...
              </>
            ) : (
              <>↓ Download PDF</>
            )}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {result.student.fullName}
              </h1>
              <p className="text-sm text-gray-500">{result.student.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Class {result.student.className}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">
                {result.quiz.subject}
              </p>
              <p className="text-xs text-gray-400">
                Class {result.quiz.classLevel}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Completed{" "}
                {new Date(result.completedAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-xs text-gray-500 uppercase mb-1">Score</p>
            <p className="text-2xl font-bold text-gray-900">
              {result.correctAnswers}/{result.totalQuestions}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-xs text-gray-500 uppercase mb-1">Accuracy</p>
            <p
              className={`text-2xl font-bold ${
                result.accuracy >= 80
                  ? "text-green-600"
                  : result.accuracy >= 50
                    ? "text-yellow-600"
                    : "text-red-500"
              }`}
            >
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

        {/* AI Feedback */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            🤖 AI Feedback
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {result.aiFeedback}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Question Breakdown
          </h2>

          {/* Summary bar */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="h-3 rounded-full bg-green-400"
              style={{
                width: `${(correctCount / result.totalQuestions) * 100}%`,
              }}
            />
            <div
              className="h-3 rounded-full bg-red-400"
              style={{
                width: `${(wrongCount / result.totalQuestions) * 100}%`,
              }}
            />
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {correctCount} correct · {wrongCount} wrong
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
