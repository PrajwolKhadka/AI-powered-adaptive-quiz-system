"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultAPI } from "@/lib/api/result-api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface QuizHistory {
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
  completedAt: string;
}

interface GraphData {
  [subject: string]: {
    date: string;
    accuracy: number;
    score: number;
    total: number;
  }[];
}
const LINE_COLORS = [
  "#000000",
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

export default function StudentResultsPage() {
  const router = useRouter();
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [graph, setGraph] = useState<GraphData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await ResultAPI.getMyResults();
        setHistory(data.history ?? []);
        setGraph(data.graph ?? {});
      } catch {
        setError("Failed to load results.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const buildChartData = () => {
    const subjects = Object.keys(graph);
    if (subjects.length === 0) return { chartData: [], subjects };

    const allDates = Array.from(
      new Set(
        subjects.flatMap((s) =>
          graph[s].map((d) =>
            new Date(d.date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })
          )
        )
      )
    );

    const chartData = allDates.map((dateLabel) => {
      const row: Record<string, any> = { date: dateLabel };
      subjects.forEach((subject) => {
        const match = graph[subject].find(
          (d) =>
            new Date(d.date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            }) === dateLabel
        );
        if (match) row[subject] = match.accuracy;
      });
      return row;
    });

    return { chartData, subjects };
  };

  const { chartData, subjects } = buildChartData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-black" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your quiz performance over time.
          </p>
        </div>

        {/* Summary Cards */}
        {history.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl shadow p-5 text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">Quizzes Taken</p>
              <p className="text-2xl font-bold text-gray-900">{history.length}</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-5 text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">Avg Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">
                {(
                  history.reduce((sum, r) => sum + r.accuracy, 0) /
                  history.length
                ).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-5 text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">Best Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.max(...history.map((r) => r.accuracy))}%
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow p-5 text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">Subjects</p>
              <p className="text-2xl font-bold text-gray-900">
                {subjects.length}
              </p>
            </div>
          </div>
        )}

        {/* Performance Graph */}
        {chartData.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-6">
              Accuracy Over Time
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value: any) => [`${value}%`, ""]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                />
                {subjects.map((subject, i) => (
                  <Line
                    key={subject}
                    type="monotone"
                    dataKey={subject}
                    stroke={LINE_COLORS[i % LINE_COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Quiz History List */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Quiz History</h2>
          </div>

          {history.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">
              You haven't completed any quizzes yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {history.map((r) => (
                <div
                  key={r.resultId}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 hover:bg-gray-50 transition"
                >
                  {/* Left */}
                  <div>
                    <p className="font-medium text-gray-900">{r.quiz.subject}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Class {r.quiz.classLevel} · {formatDate(r.completedAt)}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Score</p>
                      <p className="font-semibold text-gray-800">
                        {r.correctAnswers}/{r.totalQuestions}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Accuracy</p>
                      <p
                        className={`font-semibold ${
                          r.accuracy >= 80
                            ? "text-green-600"
                            : r.accuracy >= 50
                            ? "text-yellow-600"
                            : "text-red-500"
                        }`}
                      >
                        {r.accuracy}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Time</p>
                      <p className="font-semibold text-gray-800">
                        {formatTime(r.timeTaken)}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        router.push(
                          `/student/StudentDashboard/result/${r.quiz.id}`
                        )
                      }
                      className="text-sm font-medium text-black underline underline-offset-2 hover:opacity-60 transition"
                    >
                      View →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}