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
//   const [questionsLeft, setQuestionsLeft] = useState<number>(0);

//   // 🔥 TIMER
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

//   // 🔥 LOAD FIRST QUESTION
//   useEffect(() => {
//     loadNextQuestion();
//   }, []);

//   const loadNextQuestion = async () => {
//     const res = await QuizAPI.nextQuestion(quizId);

//     if (res.done) {
//       setResult(res);
//       setQuestion(null);
//       setQuestionsLeft(0);
//       return;
//     }

//     setQuestion(res.question);

//     // Update number of questions left
//     const remaining = res.remainingQuestions ?? null;
//     if (remaining !== null) setQuestionsLeft(remaining);
//   };

//   // Submit answer
//   const submitAnswer = async (selectedOption: string) => {
//     if (!question) return;

//     const res = await QuizAPI.submitAnswer(
//       quizId,
//       question._id,
//       selectedOption,
//       10 // or dynamic timeTaken
//     );

//     const isCorrect = res.correct;
//     // alert(isCorrect ? "Correct!" : "Wrong!");

//     loadNextQuestion();
//   };

//   // 🔹 Render Quiz Results
//   if (result) {
//     const accuracy =
//       result.totalQuestions > 0
//         ? ((result.correctAnswers / result.totalQuestions) * 100).toFixed(1)
//         : 0;

//     const totalTimeMinutes = Math.floor(result.timeTaken / 60);
//     const totalTimeSeconds = result.timeTaken % 60;

//     return (
//       <div className="p-10 text-center max-w-3xl mx-auto">
//         <h1 className="text-3xl font-bold mb-4">Quiz Completed</h1>
//         <p className="text-lg mb-1">
//           Score: {result.correctAnswers} / {result.totalQuestions}
//         </p>
//         <p className="text-lg mb-1">
//           Accuracy: {accuracy}%
//         </p>
//         <p className="text-lg mb-1">
//           Time Taken: {totalTimeMinutes}m {totalTimeSeconds}s
//         </p>
//         <p className="mt-4 text-left">
//           <strong>AI Feedback:</strong> {result.aiFeedback}
//         </p>
//       </div>
//     );
//   }

//   // 🔹 Loading state
//   if (!question) return <div className="p-10">Loading...</div>;

//   return (
//     <div className="p-10 max-w-3xl mx-auto text-red-400">
//       <div className="flex justify-between mb-2">
//         <h2 className="text-xl font-bold">{subject}</h2>
//         <span className="font-semibold">Time Left: {timeLeft}</span>
//       </div>
//       <div className="flex justify-between mb-4 text-sm text-gray-600">
//         <span>Difficulty: {question.difficulty}</span>
//         <span>Questions Left: {questionsLeft}</span>
//       </div>

//       <h3 className="text-lg mb-4">{question.text}</h3>

//       <div className="space-y-3">
//         {question.options.map((option: any, index: number) => (
//           <button
//             key={index}
//             onClick={() => submitAnswer(option.key)}
//             className="w-full bg-gray-100 hover:bg-gray-200 p-3 rounded-xl text-left"
//           >
//             {option.text}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
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
  // FIX: track answered + total separately so "Questions Left" is accurate
  const [progress, setProgress] = useState<{ answered: number; total: number } | null>(null);

  // ── COUNTDOWN TIMER ────────────────────────────────────────────────────────
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
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  // ── LOAD FIRST QUESTION ────────────────────────────────────────────────────
  useEffect(() => {
    loadNextQuestion();
  }, []);

  const loadNextQuestion = async () => {
    const res = await QuizAPI.nextQuestion(quizId);

    if (res.done) {
      setResult(res);
      setQuestion(null);
      setProgress(null);
      return;
    }

    setQuestion(res.question);

    // FIX: progress now comes from res.question.progress, not res.remainingQuestions
    if (res.question?.progress) {
      setProgress(res.question.progress);
    }
  };

  // ── SUBMIT ANSWER ──────────────────────────────────────────────────────────
  const submitAnswer = async (selectedOption: string) => {
    if (!question) return;

    await QuizAPI.submitAnswer(
      quizId,
      question._id,
      selectedOption,
      10 // replace with dynamic timeTaken if you track it
    );

    loadNextQuestion();
  };

  // ── RESULTS SCREEN ─────────────────────────────────────────────────────────
  if (result) {
    const accuracy =
      result.totalQuestions > 0
        ? ((result.correctAnswers / result.totalQuestions) * 100).toFixed(1)
        : 0;

    // FIX: use timeTakenSeconds (what the service now returns)
    const totalSeconds = result.timeTakenSeconds ?? 0;
    const totalTimeMinutes = Math.floor(totalSeconds / 60);
    const totalTimeSeconds = totalSeconds % 60;

    return (
      <div className="p-10 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Quiz Completed</h1>
        <p className="text-lg mb-1">
          Score: {result.correctAnswers} / {result.totalQuestions}
        </p>
        <p className="text-lg mb-1">Accuracy: {accuracy}%</p>
        <p className="text-lg mb-1">
          Time Taken: {totalTimeMinutes}m {totalTimeSeconds}s
        </p>
        <p className="mt-4 text-left">
          <strong>AI Feedback:</strong> {result.aiFeedback}
        </p>
      </div>
    );
  }

  // ── LOADING STATE ──────────────────────────────────────────────────────────
  if (!question) return <div className="p-10">Loading...</div>;

  // FIX: compute questionsLeft from progress object
  const questionsLeft = progress ? progress.total - progress.answered : null;

  return (
    <div className="p-10 max-w-3xl mx-auto text-red-400">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-bold">{subject}</h2>
        <span className="font-semibold">Time Left: {timeLeft}</span>
      </div>

      <div className="flex justify-between mb-4 text-sm text-gray-600">
        <span>Difficulty: {question.difficulty}</span>
        {/* FIX: only render when we have progress data */}
        {questionsLeft !== null && (
          <span>Questions Left: {questionsLeft}</span>
        )}
      </div>

      <h3 className="text-lg mb-4">{question.text}</h3>

      <div className="space-y-3">
        {question.options.map((option: any, index: number) => (
          <button
            key={index}
            onClick={() => submitAnswer(option.key)}
            className="w-full bg-gray-100 hover:bg-gray-200 p-3 rounded-xl text-left"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}