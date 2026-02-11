"use client";

import { Question } from "../page";

interface QuizTableProps {
  questions: Question[];
  selectedIds: string[];
  onSelectIds: (ids: string[]) => void;
  onEdit: (question: Question) => void;
}

export default function QuizTable({
  questions,
  selectedIds,
  onSelectIds,
  onEdit,
}: QuizTableProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectIds(questions.map((q) => q._id));
    } else {
      onSelectIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectIds([...selectedIds, id]);
    } else {
      onSelectIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  return (
    <table className="w-full border border-gray-300 rounded">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">
            <input
              type="checkbox"
              checked={selectedIds.length === questions.length && questions.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          </th>
          <th className="p-2">#</th>
          <th className="p-2">Question</th>
          <th className="p-2">Options</th>
          <th className="p-2">Correct</th>
          <th className="p-2">Subject</th>
          <th className="p-2">Difficulty</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((q) => (
          <tr key={q._id} className="border-t hover:bg-gray-50">
            <td className="p-2 text-center">
              <input
                type="checkbox"
                checked={selectedIds.includes(q._id)}
                onChange={(e) => handleSelectOne(q._id, e.target.checked)}
              />
            </td>
            <td className="p-2">{q.questionNumber}</td>
            <td className="p-2">{q.question}</td>
            <td className="p-2 text-sm">
              <div>A: {q.options.a}</div>
              <div>B: {q.options.b}</div>
              <div>C: {q.options.c}</div>
              <div>D: {q.options.d}</div>
            </td>
            <td className="p-2 text-center font-semibold">
              {q.correctAnswer.toUpperCase()}
            </td>
            <td className="p-2">{q.subject}</td>
            <td className="p-2">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  q.difficulty === "VERY EASY"
                    ? "bg-green-100 text-green-700"
                    : q.difficulty === "EASY"
                    ? "bg-blue-100 text-blue-700"
                    : q.difficulty === "MEDIUM"
                    ? "bg-yellow-100 text-yellow-700"
                    : q.difficulty === "HARD"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {q.difficulty}
              </span>
            </td>
            <td className="p-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                onClick={() => onEdit(q)}
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}