// "use client";

// import { useEffect, useState } from "react";
// import { QuizAPI } from "@/lib/api/quiz-api";

// interface Props {
//   quizId: string;
//   subject: string;
//   endTime: string;
// }

// export default function QuizClient({ quizId, subject, endTime }: Props) {
//   const [question, setQuestion] = useState<any>(null);
//   const [timeLeft, setTimeLeft] = useState("");
//   const [result, setResult] = useState<any>(null);
//   const [isEvaluating, setIsEvaluating] = useState(false);
//   const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
//   const [progress, setProgress] = useState<{ answered: number; total: number } | null>(null);

//   // ── TIMER ─────────────────────────────────────
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = Date.now();
//       const end = new Date(endTime).getTime();
//       const diff = end - now;

//       if (diff <= 0) {
//         clearInterval(interval);
//         setTimeLeft("00:00");
//         return;
//       }

//       const minutes = Math.floor(diff / 60000);
//       const seconds = Math.floor((diff % 60000) / 1000);

//       setTimeLeft(
//         `${minutes.toString().padStart(2, "0")}:${seconds
//           .toString()
//           .padStart(2, "0")}`
//       );
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [endTime]);

//   // ── LOAD QUESTION ─────────────────────────────
//   useEffect(() => {
//     loadNextQuestion();
//   }, []);

//   const loadNextQuestion = async () => {
//     setIsEvaluating(true);

//     const res = await QuizAPI.nextQuestion(quizId);

//     if (res.done) {
//       setResult(res);
//       setQuestion(null);
//       setQuestionStartTime(Date.now());
//       setProgress(null);
//       setIsEvaluating(false);
//       return;
//     }

//     setQuestion(res.question);

//     if (res.question?.progress) {
//       setProgress(res.question.progress);
//     }

//     setIsEvaluating(false);
//   };

//   // ── SUBMIT ANSWER ─────────────────────────────
//   const submitAnswer = async (selectedOption: string) => {
//     if (!question) return;
//      const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
//     await QuizAPI.submitAnswer(
//       quizId,
//       question._id,
//       selectedOption,
//       timeTaken
//     );

//     loadNextQuestion();
//   };

//   // ───────────────────────────────────────────────
//   // RESULT SCREEN
//   // ───────────────────────────────────────────────
//   if (result) {
//     const accuracy =
//       result.totalQuestions > 0
//         ? ((result.correctAnswers / result.totalQuestions) * 100).toFixed(1)
//         : 0;

//     const totalSeconds = result.timeTakenSeconds ?? 0;
//     const minutes = Math.floor(totalSeconds / 60);
//     const seconds = totalSeconds % 60;

//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
//         <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 sm:p-10">
//           <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
//             Quiz Completed
//           </h1>

//           <div className="space-y-2 text-gray-700 text-center">
//             <p>
//               Score: <strong>{result.correctAnswers}</strong> /{" "}
//               {result.totalQuestions}
//             </p>
//             <p>Accuracy: <strong>{accuracy}%</strong></p>
//             <p>
//               Time Taken: <strong>{minutes}m {seconds}s</strong>
//             </p>
//           </div>

//           <div className="mt-6 bg-gray-100 rounded-xl p-4 text-gray-800">
//             <h3 className="font-semibold mb-2">AI Feedback</h3>
//             <p className="text-sm sm:text-base">{result.aiFeedback}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ───────────────────────────────────────────────
//   // AI EVALUATING SCREEN
//   // ───────────────────────────────────────────────
//   if (isEvaluating) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-6">
//         <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-black border-solid mb-6"></div>
//         <h2 className="text-xl font-semibold mb-2">
//           Analyzing Your Performance...
//         </h2>
//         <p className="text-gray-600 max-w-sm">
//           Please wait while we generate personalized feedback.
//         </p>
//       </div>
//     );
//   }

//   if (!question) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading next question...
//       </div>
//     );
//   }

//   const questionsLeft =
//     progress ? progress.total - progress.answered : null;

//   // ───────────────────────────────────────────────
//   // MAIN QUIZ SCREEN
//   // ───────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6">
//       <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 sm:p-10">

//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
//           <h2 className="text-xl sm:text-2xl font-bold">
//             {subject}
//           </h2>

//           <div className="text-sm sm:text-base font-semibold border px-4 py-2 rounded-lg">
//             ⏳ {timeLeft}
//           </div>
//         </div>

//         {/* Meta */}
//         <div className="flex flex-col sm:flex-row sm:justify-between gap-3 text-sm text-gray-600 mb-6">
//           <span>Difficulty: {question.difficulty}</span>

//           {questionsLeft !== null && (
//             <span>Questions Left: {questionsLeft}</span>
//           )}
//         </div>

//         {/* Question */}
//         <h3 className="text-lg sm:text-xl font-medium mb-6">
//           {question.text}
//         </h3>

//         {/* Options */}
//         <div className="space-y-4">
//           {question.options.map((option: any, index: number) => (
//             <button
//               key={index}
//               onClick={() => submitAnswer(option.key)}
//               className="w-full border rounded-xl p-4 text-left hover:bg-gray-100 transition text-sm sm:text-base"
//             >
//               {option.text}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState, useCallback } from "react";
import { QuizAPI } from "@/lib/api/quiz-api";

interface Props {
  quizId: string;
  subject: string;
  endTime: string;
}

export default function QuizClient({ quizId, subject, endTime }: Props) {
  const [question, setQuestion] = useState<any>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("00:00");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [isFinishing, setIsFinishing] = useState(false);
  const [progress, setProgress] = useState<{
    answered: number;
    total: number;
  } | null>(null);

  /* ================= TIMER ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("00:00");
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setTimeLeft(
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0"
        )}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  /* ================= LOAD FIRST QUESTION ================= */
  useEffect(() => {
    loadNextQuestion();
  }, []);

  const loadNextQuestion = useCallback(async () => {
    setLoading(true);
    setSelected(null);

    const res = await QuizAPI.nextQuestion(quizId);

    if (res.done) {
      setIsFinishing(true);
      setResult(res);
      setQuestion(null);
      setProgress(null);
      setLoading(false);
      return;
    }

    setQuestion(res.question ?? null);

    if (res.question?.progress) {
      setProgress(res.question.progress);
    }

    setQuestionStartTime(Date.now());
    setLoading(false);
  }, [quizId]);

  /* ================= SUBMIT ANSWER ================= */
  const submitAnswer = async (optionKey: string) => {
    if (!question || selected) return;

    setSelected(optionKey);

    const timeTaken = Math.round(
      (Date.now() - questionStartTime) / 1000
    );

    await QuizAPI.submitAnswer(
      quizId,
      question._id,
      optionKey,
      timeTaken
    );

    loadNextQuestion();
  };

  /* ================= RESULT SCREEN ================= */
  if (isFinishing && !result) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-6 text-center px-6">
      <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-black" />
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Analyzing Your Performance...
        </h2>
        <p className="text-gray-500 text-sm max-w-sm">
          Please wait while we generate your personalized feedback.
        </p>
      </div>
    </div>
  );
}
  if (result) {
    const accuracy =
      result.totalQuestions > 0
        ? (
            (result.correctAnswers / result.totalQuestions) *
            100
          ).toFixed(1)
        : "0";

    const totalSeconds = result.timeTakenSeconds ?? 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10 text-black">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 text-center space-y-6 text-black">
          <h1 className="text-3xl font-bold">🎉 Quiz Completed</h1>

          <div className="text-gray-700 text-lg space-y-2">
            <p>
              Score: <strong>{result.correctAnswers}</strong> /{" "}
              {result.totalQuestions}
            </p>

            <p>
              Accuracy: <strong>{accuracy}%</strong>
            </p>

            <p>
              Time Taken:{" "}
              <strong>
                {minutes}m {seconds}s
              </strong>
            </p>
          </div>

          {result.aiFeedback && (
            <div className="bg-gray-100 rounded-2xl p-5 text-sm text-gray-800 text-left">
              <h3 className="font-semibold mb-2">
                🤖 AI Feedback
              </h3>
              <button
                onClick={() => window.location.href = '/student/StudentDashboard/homepage'}
                className="text-blue-600 font-medium mb-2"
              >
                Back to Homepage
              </button>
              {result.aiFeedback}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ================= LOADING STATE ================= */
  if (loading && !isFinishing) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-6">
      <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-black" />
      <p className="text-gray-500 font-medium animate-pulse">
        Loading next question...
      </p>
    </div>
  );
}

  const questionsLeft =
    progress?.total && progress?.answered !== undefined
      ? progress.total - progress.answered
      : null;

  /* ================= MAIN QUIZ UI ================= */
  if (!question) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 text-black">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold">{subject}</h2>

          <div className="px-5 py-2 rounded-xl border font-semibold text-sm">
            ⏳ {timeLeft}
          </div>
        </div>

        {/* Meta */}
        <div className="flex justify-between text-sm text-gray-500 mb-6">
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
          {question.options.map((option: any) => {
            const isSelected = selected === option.key;

            return (
              <button
                key={option.key}
                disabled={!!selected}
                onClick={() => submitAnswer(option.key)}
                className={`w-full rounded-2xl p-4 text-left transition-all duration-200
                  ${
                    isSelected
                      ? "bg-black text-white"
                      : "border hover:bg-gray-100"
                  }
                  ${selected ? "cursor-not-allowed opacity-70" : ""}
                `}
              >
                {option.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}