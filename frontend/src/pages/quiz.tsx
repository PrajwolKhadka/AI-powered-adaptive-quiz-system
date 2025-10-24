// import React, { useEffect, useState } from "react";
// import QuestionCard from "../components/questioncard.tsx";
// import { fetchQuestion, submitResult } from "../api/api.ts";

// interface AnswerType {
//   question: string;
//   correct: boolean;
// }

// const Quiz: React.FC = () => {
//   const [currentQuestion, setCurrentQuestion] = useState<any>(null);
//   const [questionNumber, setQuestionNumber] = useState(1);
//   const [score, setScore] = useState(0);
//   const [answers, setAnswers] = useState<AnswerType[]>([]);
//   const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
//   const [quizOver, setQuizOver] = useState(false);
//   const [shownQuestionIds, setShownQuestionIds] = useState<number[]>([]);

//   const loadQuestion = async () => {
//     let q;
//     let attempts = 0;
//     do {
//       q = await fetchQuestion(difficulty);
//       attempts++;
//       // avoid repeating questions
//     } while (shownQuestionIds.includes(q.id) && attempts < 10);

//     setCurrentQuestion(q);
//     setShownQuestionIds(prev => [...prev, q.id]);
//   };

//   useEffect(() => {
//     if (!quizOver) loadQuestion();
//   }, [questionNumber, difficulty]); // trigger on questionNumber or difficulty change

//   const handleAnswer = (correct: boolean) => {
//     setScore(prev => prev + (correct ? 1 : 0));
//     setAnswers(prev => [...prev, { question: currentQuestion.question_text, correct }]);

//     let nextDifficulty = difficulty;

//     // Adaptive logic starts from question 4
//     if (questionNumber >= 4) {
//       if (correct) nextDifficulty = difficulty === "easy" ? "medium" : difficulty === "medium" ? "hard" : "hard";
//       else nextDifficulty = difficulty === "hard" ? "medium" : difficulty === "medium" ? "easy" : "easy";
//     }

//     if (questionNumber >= 10) {
//       setQuizOver(true);
//       return;
//     }

//     setDifficulty(nextDifficulty);
//     setQuestionNumber(prev => prev + 1);
//   };

//   const handleSubmit = async () => {
//     await submitResult(1, score, answers); // replace 1 with logged-in userId
//     alert("Result submitted!");
//   };

//   if (quizOver)
//     return (
//       <div className="p-6 text-center">
//         <h1 className="text-2xl font-bold mb-4">Quiz Over</h1>
//         <p className="mb-4">Your score: {score}</p>
//         <button
//           className="px-4 py-2 bg-green-500 text-white rounded"
//           onClick={handleSubmit}
//         >
//           Submit
//         </button>
//       </div>
//     );

//   return currentQuestion ? (
//     <div className="p-6">
//     <p className="text-right text-sm text-gray-500 mb-2">
//       Question {questionNumber}/15
//     </p>
//     <QuestionCard question={currentQuestion} onAnswer={handleAnswer} difficulty={difficulty}/>
//   </div>
// ) : (
//   <p className="text-center mt-6">Loading...</p>
// );
// };

// export default Quiz;


import React, { useEffect, useState } from "react";
import QuestionCard from "../components/questioncard.tsx";
import { fetchQuestion, submitResult } from "../api/api.ts";

interface AnswerType {
  question: string;
  correct: boolean;
}

const TOTAL_QUESTIONS = 15;

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [quizOver, setQuizOver] = useState(false);
  const [shownQuestionIds, setShownQuestionIds] = useState<number[]>([]);

  const loadQuestion = async () => {
    let q;
    let attempts = 0;
    do {
      q = await fetchQuestion(difficulty);
      attempts++;
    } while (shownQuestionIds.includes(q.id) && attempts < 10);

    setCurrentQuestion(q);
    setShownQuestionIds(prev => [...prev, q.id]);
  };

  useEffect(() => {
    if (!quizOver && questionNumber <= TOTAL_QUESTIONS) loadQuestion();
  }, [questionNumber, difficulty]);

  const handleAnswer = (correct: boolean) => {
    setScore(prev => prev + (correct ? 1 : 0));
    setAnswers(prev => [...prev, { question: currentQuestion.question_text, correct }]);

    let nextDifficulty = difficulty;

    if (questionNumber >= 4) {
      if (correct) nextDifficulty =
        difficulty === "easy" ? "medium" :
        difficulty === "medium" ? "hard" : "hard";
      else nextDifficulty =
        difficulty === "hard" ? "medium" :
        difficulty === "medium" ? "easy" : "easy";
    }

    if (questionNumber >= TOTAL_QUESTIONS) {
      setQuizOver(true);
      return;
    }

    setDifficulty(nextDifficulty);
    setQuestionNumber(prev => prev + 1);
  };

  const handleSubmit = async () => {
    await submitResult(1, score, answers); // replace 1 with logged-in userId
    alert("Result submitted!");
  };

  if (quizOver)
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Quiz Over</h1>
        <p className="mb-4">Your score: {score}</p>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    );

  return currentQuestion ? (
    <div className="p-6">
      <p className="text-right text-sm text-gray-500 mb-2">
        Question {questionNumber}/{TOTAL_QUESTIONS}
      </p>
      <QuestionCard question={currentQuestion} onAnswer={handleAnswer} difficulty={difficulty}/>
    </div>
  ) : (
    <p className="text-center mt-6">Loading...</p>
  );
};

export default Quiz;
