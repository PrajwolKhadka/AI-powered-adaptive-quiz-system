"use client";

import { useState } from "react";
import { QuizAPI } from "@/lib/api/quiz-api";

interface EnableQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const subjects = ["Computer Sc.", "Science", "Maths", "Nepali", "English", "Social", "EPH"];
const classes = [6,7,8,9,10,11,12];

export default function EnableQuizModal({ isOpen, onClose, onSuccess }: EnableQuizModalProps) {
  const [classLevel, setClassLevel] = useState<number>(6);
  const [subject, setSubject] = useState<string>(subjects[0]);
  const [duration, setDuration] = useState<number>(30);
  const [loading, setLoading] = useState(false);

  const handleEnable = async () => {
    if (duration < 1 || duration > 60) return alert("Duration must be 1-60 minutes");
    setLoading(true);
    try {
      await QuizAPI.toggleQuiz({ classLevel, subject, durationMinutes: duration, isActive: true });
      alert("Quiz enabled successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to enable quiz");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-96 max-w-full">
        <h2 className="text-xl font-bold mb-4">Enable Quiz</h2>

        <label className="block mb-2">
          Class:
          <select value={classLevel} onChange={(e) => setClassLevel(Number(e.target.value))} className="w-full border px-2 py-1 rounded">
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label className="block mb-2">
          Subject:
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full border px-2 py-1 rounded">
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <label className="block mb-4">
          Duration (minutes):
          <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full border px-2 py-1 rounded" min={1} max={60} />
        </label>

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleEnable} disabled={loading}>
            {loading ? "Enabling..." : "Enable"}
          </button>
        </div>
      </div>
    </div>
  );
}
