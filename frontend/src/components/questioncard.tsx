// import React from "react";

// type QuestionCardProps = {
//   question: any;
//   onAnswer: (correct: boolean) => void;
//    difficulty?: "easy" | "medium" | "hard";
// };

// const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer,difficulty }) => {
//   const handleClick = (index: number) => {
//     onAnswer(index === question.correct_option);
//   };

//   return (
//     <div className="p-6 border rounded shadow-md bg-white max-w-xl mx-auto">
//       <h2 className="text-xl font-bold mb-4">{question.question_text}</h2>
//       <p className="text-sm text-gray-500 mb-2">Difficulty: {difficulty}</p> 
//       <div className="flex flex-col gap-2">
//         {question.options.map((opt: string, idx: number) => (
//           <button
//             key={idx}
//             className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             onClick={() => handleClick(idx)}
//           >
//             {opt}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QuestionCard;

import React, { useEffect } from "react"

type QuestionCardProps = {
  question: any
  onAnswer: (correct: boolean) => void
  difficulty?: "easy" | "medium" | "hard"
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, difficulty }) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)
  const [answered, setAnswered] = React.useState(false)

  const handleClick = (index: number) => {
    if (!answered) {
      setSelectedIndex(index)
      setAnswered(true)
      setTimeout(() => {
        onAnswer(index === question.correct_option)
      }, 300)
    }
  }


  const difficultyBadgeColors = {
    easy: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    medium: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    hard: "bg-red-500/20 text-red-300 border border-red-500/30",
  }
  useEffect(() => {
  setSelectedIndex(null)
  setAnswered(false)
}, [question])

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Card Container */}
      <div className="relative group">
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Main Card */}
        <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Question Header */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">{question.question_text}</h2>

            {/* Difficulty Badge */}
            {difficulty && (
              <div
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${difficultyBadgeColors[difficulty]}`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Difficulty
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {question.options.map((opt: string, idx: number) => {
              const isSelected = selectedIndex === idx
              const isCorrect = idx === question.correct_option
              const showResult = answered && isSelected

              return (
                <button
                  key={idx}
                  onClick={() => handleClick(idx)}
                  disabled={answered}
                  className={`w-full p-4 rounded-xl font-semibold text-left transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed
                    ${
                      showResult
                        ? isCorrect
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/50 scale-105"
                          : "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/50"
                        : isSelected
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50"
                          : "bg-slate-700/50 hover:bg-slate-700/80 text-slate-100 border border-slate-600/50 hover:border-slate-500/80"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {showResult && <span className="text-xl">{isCorrect ? "✓" : "✗"}</span>}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Answer Feedback */}
          {answered && (
            <div
              className={`mt-6 p-4 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-300
                ${
                  selectedIndex === question.correct_option
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }
              `}
            >
              {selectedIndex === question.correct_option
                ? "Correct! Great job! 🎉"
                : "Incorrect. Better luck next time!"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestionCard
