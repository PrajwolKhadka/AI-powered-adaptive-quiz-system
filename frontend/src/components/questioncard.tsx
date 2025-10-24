import React from "react";

type QuestionCardProps = {
  question: any;
  onAnswer: (correct: boolean) => void;
   difficulty?: "easy" | "medium" | "hard";
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer,difficulty }) => {
  const handleClick = (index: number) => {
    onAnswer(index === question.correct_option);
  };

  return (
    <div className="p-6 border rounded shadow-md bg-white max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">{question.question_text}</h2>
      <p className="text-sm text-gray-500 mb-2">Difficulty: {difficulty}</p> 
      <div className="flex flex-col gap-2">
        {question.options.map((opt: string, idx: number) => (
          <button
            key={idx}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handleClick(idx)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
