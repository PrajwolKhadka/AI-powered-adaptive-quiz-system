"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { QuizAPI } from "@/lib/api/quiz-api";
import UploadCSV from "./_components/UploadCSV";
import QuizTable from "./_components/QuizTable";
import EditQuestionModal from "./_components/EditQuestion";
import EnableQuizModal from "./_components/EnableQuizModal";
import toast from "react-hot-toast";

console.log("QuizAPI methods:", Object.keys(QuizAPI));
export interface Question {
  _id: string;
  questionNumber: number;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  correctAnswer: "a" | "b" | "c" | "d";
  subject: string;
  difficulty: string;
}

export default function QuizzesPage() {
  const { loading: authLoading } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEnableModalOpen, setEnableModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 6;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await QuizAPI.getQuestions();
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // const handleDeleteAll = async () => {
  //   if (questions.length === 0) {
  //     toast.error("No questions to delete");
  //     return;
  //   }

  //   const confirmed = confirm(
  //     "Are you sure you want to delete ALL questions? This cannot be undone.",
  //   );

  //   if (!confirmed) return;

  //   try {
  //     await QuizAPI.deleteAllQuestions();

  //     setSelectedIds([]);
  //     setCurrentPage(1);
  //     fetchQuestions();
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to delete all questions");
  //   }
  // };

  // const handleBatchDelete = async () => {
  //   if (!selectedIds.length) return toast.error("Select questions first!");
  //   if (!confirm("Are you sure you want to delete selected questions?")) return;

  //   try {
  //     await QuizAPI.deleteBatchQuestions(selectedIds);
  //     setSelectedIds([]);
  //     fetchQuestions();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const confirmToast = (message: string, onConfirm: () => void) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>{message}</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                onConfirm();
              }}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Confirm
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-300 text-black px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  const handleDeleteAll = async () => {
    if (questions.length === 0) return toast.error("No questions to delete");

    confirmToast("Delete ALL questions? This cannot be undone.", async () => {
      try {
        await QuizAPI.deleteAllQuestions();
        setSelectedIds([]);
        setCurrentPage(1);
        fetchQuestions();
        toast.success("All questions deleted");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete all questions");
      }
    });
  };

  const handleBatchDelete = async () => {
    if (!selectedIds.length) return toast.error("Select questions first!");

    confirmToast("Delete selected questions?", async () => {
      try {
        await QuizAPI.deleteBatchQuestions(selectedIds);
        setSelectedIds([]);
        fetchQuestions();
        toast.success("Selected questions deleted");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete selected questions");
      }
    });
  };
  const handleSaveEdit = async (question: Question) => {
    try {
      await QuizAPI.updateQuestion(question);
      setEditingQuestion(null);
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Slice questions for current page
  const currentQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage,
  );

  if (authLoading) return <div>Checking session...</div>;

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Quiz Questions</h1>

      <UploadCSV
        questionsExist={questions.length > 0}
        onUploadSuccess={fetchQuestions}
      />

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleBatchDelete}
          disabled={selectedIds.length === 0}
          className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Delete Selected
        </button>
        {/* <button className="ml-auto bg-green-600 text-white px-4 py-2 rounded">
          Enable Quiz
        </button> */}
        <button
          onClick={handleDeleteAll}
          disabled={questions.length === 0}
          className="bg-red-800 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Delete All
        </button>

        <button
          className="ml-auto bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setEnableModalOpen(true)}
        >
          Enable Quiz
        </button>
      </div>

      {loading ? (
        <div>Loading questions...</div>
      ) : (
        <QuizTable
          questions={currentQuestions}
          selectedIds={selectedIds}
          onSelectIds={setSelectedIds}
          onEdit={setEditingQuestion}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {(() => {
            const pageButtons = [];
            let startPage = Math.max(currentPage - 2, 1);
            let endPage = Math.min(startPage + 4, totalPages);

            if (endPage - startPage < 4) {
              startPage = Math.max(endPage - 4, 1);
            }

            for (let num = startPage; num <= endPage; num++) {
              pageButtons.push(
                <button
                  key={num}
                  onClick={() => goToPage(num)}
                  className={`px-3 py-1 border rounded ${num === currentPage ? "bg-blue-600 text-white" : ""}`}
                >
                  {num}
                </button>,
              );
            }

            return pageButtons;
          })()}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {editingQuestion && (
        <EditQuestionModal
          question={editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSave={handleSaveEdit}
        />
      )}
      <EnableQuizModal
        isOpen={isEnableModalOpen}
        onClose={() => setEnableModalOpen(false)}
        onSuccess={fetchQuestions} // refresh questions after enabling
      />
    </div>
  );
}
