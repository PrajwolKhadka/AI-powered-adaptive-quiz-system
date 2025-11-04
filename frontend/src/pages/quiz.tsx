// //   const loadQuestion = async () => {
// //     let q;
// //     let attempts = 0;
// //     do {
// //       q = await fetchQuestion(difficulty);
// //       attempts++;
// //       // avoid repeating questions
// //     } while (shownQuestionIds.includes(q.id) && attempts < 10);

// //     setCurrentQuestion(q);
// //     setShownQuestionIds(prev => [...prev, q.id]);
// //   };

// //   useEffect(() => {
// //     if (!quizOver) loadQuestion();
// //   }, [questionNumber, difficulty]); // trigger on questionNumber or difficulty change

// //   const handleAnswer = (correct: boolean) => {
// //     setScore(prev => prev + (correct ? 1 : 0));
// //     setAnswers(prev => [...prev, { question: currentQuestion.question_text, correct }]);

// //     let nextDifficulty = difficulty;

// //     // Adaptive logic starts from question 4
// //     if (questionNumber >= 4) {
// //       if (correct) nextDifficulty = difficulty === "easy" ? "medium" : difficulty === "medium" ? "hard" : "hard";
// //       else nextDifficulty = difficulty === "hard" ? "medium" : difficulty === "medium" ? "easy" : "easy";
// //     }

// //     if (questionNumber >= 10) {
// //       setQuizOver(true);
// //       return;
// //     }

// //     setDifficulty(nextDifficulty);
// //     setQuestionNumber(prev => prev + 1);
// //   };

// //   const handleSubmit = async () => {
// //     await submitResult(1, score, answers); // replace 1 with logged-in userId
// //     alert("Result submitted!");
// //   };

// //   if (quizOver)
// //     return (
// //       <div className="p-6 text-center">
// //         <h1 className="text-2xl font-bold mb-4">Quiz Over</h1>
// //         <p className="mb-4">Your score: {score}</p>
// //         <button
// //           className="px-4 py-2 bg-green-500 text-white rounded"
// //           onClick={handleSubmit}
// //         >
// //           Submit
// //         </button>
// //       </div>
// //     );



import type React from "react"
import { useEffect, useRef, useState } from "react"
import QuestionCard from "../components/questioncard.tsx"
// import { fetchQuestion, submitResult } from "../api/api.ts";
// const extractStrengths = (text: string) => {
//   const match = text.match(/Strengths[:\s]*(.*?)(?=Weaknesses|Tips|$)/i);
//   return match ? match[1] : "N/A";
// };

// const extractWeaknesses = (text: string) => {
//   const match = text.match(/Weaknesses[:\s]*(.*?)(?=Tips|$)/i);
//   return match ? match[1] : "N/A";
// };

// const extractTip = (text: string) => {
//   const match = text.match(/Tips[:\s]*(.*)/i);
//   return match ? match[1] : "Keep practicing and stay consistent!";
// };
interface AnswerType {
  question: string
  correct: boolean
}

const TOTAL_QUESTIONS = 15
interface QuizProps {
  student: { id: number; name: string; school_id: number };
}
const Quiz: React.FC<QuizProps> = ({student}) => {
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<AnswerType[]>([])
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const [quizOver, setQuizOver] = useState(false)
  const [shownQuestionIds, setShownQuestionIds] = useState<number[]>([])
  const [evaluation, setEvaluation] = useState<string>("");

  const countdownRef = useRef<number | null>(null)

 const loadQuestion = async () => {
  try {
    const excludeParam = shownQuestionIds.join(",");

    const res = await fetch(
      `http://localhost:5000/api/question?difficulty=${difficulty}&excludeIds=${excludeParam}`
    );

    if (!res.ok) {
      if (res.status === 404) {
        setQuizOver(true);
      }
      return;
    }

    const question = await res.json();

    question.options = Array.isArray(question.options)
      ? question.options
      : JSON.parse(question.options);

    setCurrentQuestion(question);
    setShownQuestionIds((prev) => [...prev, question.id]);
  } catch (error) {
    console.error("Error fetching question:", error);
  }
};

   useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User left the tab
        countdownRef.current = window.setTimeout(() => {
          setScore(0)
          setQuizOver(true)
          alert("You took too long away from the quiz. Your score is 0!")
        }, 10000) // 10 seconds
      } else {
        // User returned
        if (countdownRef.current) {
          clearTimeout(countdownRef.current)
          countdownRef.current = null
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      if (countdownRef.current) clearTimeout(countdownRef.current)
    }
  }, [])

// const loadQuestion = async () => {
//   const remainingQuestions = mockQuestions.filter(q => !shownQuestionIds.includes(q.id))
//   if (remainingQuestions.length === 0) {
//     setQuizOver(true)
//     return
//   }
//   // const randomQuestion = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)]
//   // setCurrentQuestion(randomQuestion)
//   // setShownQuestionIds(prev => [...prev, randomQuestion.id])
//   const randomQuestion = mockQuestions[Math.floor(Math.random() * mockQuestions.length)]
//   setCurrentQuestion(randomQuestion)

// }

  useEffect(() => {
    if (!quizOver && questionNumber <= TOTAL_QUESTIONS) {
      loadQuestion()
    }
  }, [questionNumber, difficulty, quizOver])

  const handleAnswer = (correct: boolean) => {
    setScore((prev) => prev + (correct ? 1 : 0))
    setAnswers((prev) => [...prev, { question: currentQuestion.question_text, correct }])

    let nextDifficulty = difficulty

    if (questionNumber >= 4) {
      if (correct) nextDifficulty = difficulty === "easy" ? "medium" : difficulty === "medium" ? "hard" : "hard"
      else nextDifficulty = difficulty === "hard" ? "medium" : difficulty === "medium" ? "easy" : "easy"
    }

    if (questionNumber >= TOTAL_QUESTIONS) {
      setQuizOver(true)
      return
    }

    setTimeout(() => {
    setDifficulty(nextDifficulty)
    setQuestionNumber((prev) => prev + 1)
  }, 500)
}
  // const handleSubmit = async () => {
  //   console.log("Quiz results:", { score, answers })
  //   alert(`Quiz submitted! Final Score: ${score}/${TOTAL_QUESTIONS}`)
  // }
  const handleSubmit = async () => {
  try {
    // Prepare difficulty array (same logic as adaptive quiz)
    const difficultyLevels = answers.map((_, idx) =>
      idx < 4 ? "easy" : idx < 10 ? "medium" : "hard"
    );

    const payload = { answers, difficultyLevels, totalScore: score };

    // Call your backend Gemini AI endpoint
    const res = await fetch("http://localhost:5000/api/psycho", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setEvaluation(data.evaluation);

    await fetch("http://localhost:5000/api/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: student.id,
        score,
        psychometric: data.evaluation,
      }),
    });

    console.log("Quiz results submitted with AI evaluation:", data.evaluation);
  } catch (err) {
    console.error(err);
    alert("Failed to generate psychometric evaluation");
  }
};

  if (quizOver) {
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100)
    const performanceMessage =
      percentage >= 80 ? "Outstanding Performance! 🌟" : percentage >= 60 ? "Great Job! 👏" : "Good Effort! 💪"

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Results Card */}
        <div className="relative z-10 max-w-md w-full">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Quiz Complete!
            </h1>
            <p className="text-slate-400 mb-8">{performanceMessage}</p>

            {/* Score Display */}
            <div className="mb-8">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(71, 85, 105, 0.3)" strokeWidth="8" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={`${(percentage / 100) * 351.86} 351.86`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <p className="text-3xl font-bold text-white">{percentage}%</p>
                    <p className="text-sm text-slate-400">
                      {score}/{TOTAL_QUESTIONS}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                <p className="text-emerald-400 text-sm font-semibold">Correct</p>
                <p className="text-2xl font-bold text-emerald-300">{score}</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 text-sm font-semibold">Incorrect</p>
                <p className="text-2xl font-bold text-red-300">{TOTAL_QUESTIONS - score}</p>
              </div>
            </div>
             {evaluation && evaluation.trim() !== "" && (
          <div className="mt-6 p-6 bg-slate-800/70 border border-slate-700 rounded-2xl text-white shadow-lg max-w-full mx-auto text-left">
            <h2 className="text-2xl font-bold mb-4 text-gradient bg-clip-text from-blue-400 to-purple-400 text-white">
              🧠 Psychometric Evaluation Report
            </h2>
            <div className="prose prose-invert max-w-full text-justify">
              {evaluation.split("\n\n").map((section, idx) => (
                <p key={idx} className="mb-4">{section.trim()}</p>
              ))}
            </div>
          </div>
        )}


            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Submit Results
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-slate-300 font-semibold">
            Question {questionNumber} of {TOTAL_QUESTIONS}
          </p>
          <p className="text-slate-400 text-sm">
            Score: <span className="text-emerald-400 font-bold">{score}</span>
          </p>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden border border-slate-600/50">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500"
            style={{
              width: `${(questionNumber / TOTAL_QUESTIONS) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="relative z-10 w-full">
        {currentQuestion ? (
          <QuestionCard question={currentQuestion} onAnswer={handleAnswer} difficulty={difficulty} />
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
              </div>
              <p className="text-slate-300 mt-4 font-semibold">Loading question...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Quiz
