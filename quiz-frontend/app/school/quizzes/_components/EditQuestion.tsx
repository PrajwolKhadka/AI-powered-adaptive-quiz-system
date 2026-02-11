"use client";

import { useState } from "react";
import { Question } from "../page";

interface EditQuestionModalProps {
  question: Question;
  onClose: () => void;
  onSave: (question: Question) => void;
}

export default function EditQuestionModal({
  question,
  onClose,
  onSave,
}: EditQuestionModalProps) {
  const [editedQuestion, setEditedQuestion] = useState<Question>(question);

  const handleSave = () => {
    onSave(editedQuestion);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Question</h2>

        <label className="block mb-3">
          <span className="text-sm font-medium text-gray-700">Question:</span>
          <textarea
            value={editedQuestion.question}
            onChange={(e) =>
              setEditedQuestion({ ...editedQuestion, question: e.target.value })
            }
            className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </label>

        <div className="grid grid-cols-2 gap-3 mb-3">
          {["a", "b", "c", "d"].map((opt) => (
            <label className="block" key={opt}>
              <span className="text-sm font-medium text-gray-700">
                Option {opt.toUpperCase()}:
              </span>
              <input
                type="text"
                value={editedQuestion.options[opt as keyof typeof editedQuestion.options]}
                onChange={(e) =>
                  setEditedQuestion({
                    ...editedQuestion,
                    options: { ...editedQuestion.options, [opt]: e.target.value },
                  })
                }
                className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Correct Answer:</span>
            <select
              value={editedQuestion.correctAnswer}
              onChange={(e) =>
                setEditedQuestion({
                  ...editedQuestion,
                  correctAnswer: e.target.value as any,
                })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {["a", "b", "c", "d"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt.toUpperCase()}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Subject:</span>
            <input
              type="text"
              value={editedQuestion.subject}
              onChange={(e) =>
                setEditedQuestion({ ...editedQuestion, subject: e.target.value })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Difficulty:</span>
            <select
              value={editedQuestion.difficulty}
              onChange={(e) =>
                setEditedQuestion({ ...editedQuestion, difficulty: e.target.value })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {["VERY EASY", "EASY", "MEDIUM", "HARD", "VERY HARD"].map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}