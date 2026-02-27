"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultAPI } from "@/lib/api/result-api";

interface Quiz {
  id: string;
  subject: string;
  classLevel: number;
  isActive: boolean;
  startTime: string | null;
  endTime: string | null;
  totalQuestions: number;
  createdAt: string;
}

export default function SchoolResultsPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await ResultAPI.getSchoolQuizzes();
        setQuizzes(data);
      } catch {
        setError("Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Results</h1>
        <p className="text-gray-500 mb-8 text-sm">
          Select a quiz to view student results.
        </p>

        {quizzes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-400">
            No quizzes found.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="text-left px-6 py-4">Subject</th>
                  <th className="text-left px-6 py-4">Class</th>
                  <th className="text-left px-6 py-4">Questions</th>
                  <th className="text-left px-6 py-4">Start Time</th>
                  <th className="text-left px-6 py-4">End Time</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quizzes.map((quiz) => (
                  <tr
                    key={quiz.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {quiz.subject}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      Class {quiz.classLevel}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {quiz.totalQuestions}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(quiz.startTime)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(quiz.endTime)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          quiz.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {quiz.isActive ? "Active" : "Ended"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          router.push(`/school/results/${quiz.id}`)
                        }
                        className="text-sm font-medium text-black underline underline-offset-2 hover:opacity-70 transition"
                      >
                        View Results
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
