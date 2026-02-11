// // "use client";

// // import { useEffect, useState } from "react";
// // import { useAuth } from "@/context/AuthContext";
// // import axiosInstance from "@/lib/api/axios";
// // import { QuizAPI } from "@/lib/api/quiz-api";
// // interface Question {
// //   _id: string;
// //   questionNumber: number;
// //   question: string;
// //   options: { a: string; b: string; c: string; d: string };
// //   correctAnswer: "a" | "b" | "c" | "d";
// //   subject: string;
// //   difficulty: string;
// // }

// // export default function QuizzesPage() {
// //   const { user, isAuthenticated, loading: authLoading } = useAuth();
// //   const [file, setFile] = useState<File | null>(null);
// //   const [uploading, setUploading] = useState(false);
// //   const [questions, setQuestions] = useState<Question[]>([]);
// //   const [selectedIds, setSelectedIds] = useState<string[]>([]);
// //   const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
// //   const [loading, setLoading] = useState(false);

// //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.files && e.target.files[0]) {
// //       setFile(e.target.files[0]);
// //     }
// //   };

// //   const handleUpload = async () => {
// //     if (!file) return alert("Please select a CSV file first");
// //     setUploading(true);

// //     const formData = new FormData();
// //     formData.append("file", file);

// //     try {
// //       const res = await QuizAPI.uploadCSV(file);
// //       alert(`CSV uploaded: ${res.inserted} inserted, ${res.failed} failed`);
// //       setFile(null);
// //       fetchQuestions();
// //     } catch (err: any) {
// //       console.error(err);
// //       alert(err.response?.data?.error || "Upload failed");
// //     } finally {
// //       setUploading(false);
// //     }
// //   };

// // const fetchQuestions = async () => {
// //     setLoading(true);
// //     try {
// //       const data = await QuizAPI.getQuestions();
// //       setQuestions(data);
// //     } catch (err) {
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchQuestions();
// //   }, []);

// //   const handleBatchDelete = async () => {
// //     if (!selectedIds.length) return alert("Select questions first!");
// //     if (!confirm("Are you sure you want to delete selected questions?")) return;
// //     try {
// //       await QuizAPI.deleteBatchQuestions(selectedIds);
// //       setSelectedIds([]);
// //       fetchQuestions();
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   const handleSaveEdit = async (question: Question) => {
// //     try {
// //       await QuizAPI.updateQuestion(question);
// //       setEditingQuestion(null);
// //       fetchQuestions();
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   if (authLoading) return <div>Checking session...</div>;

// //   return (
// //     <div className="p-6 text-black">
// //       <h1 className="text-2xl font-bold mb-4">Quiz Questions</h1>

// //       {/* Upload CSV */}
// //       <div className="flex gap-2 mb-4">
// //         <input type="file" accept=".csv" onChange={handleFileChange} className="border p-2 rounded" disabled={questions.length > 0} />
        
// //         <button
// //           onClick={handleUpload}
// //           disabled={!file || uploading || questions.length > 0}
// //           className="bg-blue-600 text-black px-4 py-2 rounded disabled:opacity-50"
// //         >
// //           {uploading ? "Uploading..." : "Upload CSV"}
// //         </button>
// //         <button
// //           onClick={handleBatchDelete}
// //           disabled={selectedIds.length === 0}
// //           className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
// //         >
// //           Delete Selected
// //         </button>
// //         <button className="ml-auto bg-green-600 text-white px-4 py-2 rounded">
// //           Enable Quiz
// //         </button>
        
// //       </div>

// //       {/* Questions Table */}
// //       {loading ? (
// //         <div>Loading questions...</div>
// //       ) : (
// //         <table className="w-full border border-gray-300 rounded">
// //           <thead>
// //             <tr className="bg-gray-100">
// //               <th className="p-2">
// //                 <input
// //                   type="checkbox"
// //                   checked={selectedIds.length === questions.length && questions.length > 0}
// //                   onChange={(e) =>
// //                     e.target.checked
// //                       ? setSelectedIds(questions.map((q) => q._id))
// //                       : setSelectedIds([])
// //                   }
// //                 />
// //               </th>
// //               <th className="p-2">#</th>
// //               <th className="p-2">Question</th>
// //               <th className="p-2">Options</th>
// //               <th className="p-2">Correct</th>
// //               <th className="p-2">Subject</th>
// //               <th className="p-2">Difficulty</th>
// //               <th className="p-2">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {questions.map((q) => (
// //               <tr key={q._id} className="border-t">
// //                 <td className="p-2 text-center">
// //                   <input
// //                     type="checkbox"
// //                     checked={selectedIds.includes(q._id)}
// //                     onChange={(e) => {
// //                       if (e.target.checked) setSelectedIds([...selectedIds, q._id]);
// //                       else setSelectedIds(selectedIds.filter((id) => id !== q._id));
// //                     }}
// //                   />
// //                 </td>
// //                 <td className="p-2">{q.questionNumber}</td>
// //                 <td className="p-2">{q.question}</td>
// //                 <td className="p-2">
// //                   A: {q.options.a}, B: {q.options.b}, C: {q.options.c}, D: {q.options.d}
// //                 </td>
// //                 <td className="p-2">{q.correctAnswer.toUpperCase()}</td>
// //                 <td className="p-2">{q.subject}</td>
// //                 <td className="p-2">{q.difficulty}</td>
// //                 <td className="p-2 flex gap-2">
// //                   <button
// //                     className="bg-yellow-500 text-white px-2 py-1 rounded"
// //                     onClick={() => setEditingQuestion(q)}
// //                   >
// //                     Edit
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       )}

// //       {/* Edit Modal */}
// //       {editingQuestion && (
// //         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
// //           <div className="bg-white p-6 rounded w-96 max-w-full">
// //             <h2 className="text-xl font-bold mb-2">Edit Question</h2>
// //             <label className="block mb-2">
// //               Question:
// //               <input
// //                 type="text"
// //                 value={editingQuestion.question}
// //                 onChange={(e) =>
// //                   setEditingQuestion({ ...editingQuestion, question: e.target.value })
// //                 }
// //                 className="w-full border px-2 py-1 rounded"
// //               />
// //             </label>

// //             {["a", "b", "c", "d"].map((opt) => (
// //               <label className="block mb-2" key={opt}>
// //                 Option {opt.toUpperCase()}:
// //                 <input
// //                   type="text"
// //                   value={editingQuestion.options[opt as keyof typeof editingQuestion.options]}
// //                   onChange={(e) =>
// //                     setEditingQuestion({
// //                       ...editingQuestion,
// //                       options: { ...editingQuestion.options, [opt]: e.target.value },
// //                     })
// //                   }
// //                   className="w-full border px-2 py-1 rounded"
// //                 />
// //               </label>
// //             ))}

// //             <label className="block mb-2">
// //               Correct Answer:
// //               <select
// //                 value={editingQuestion.correctAnswer}
// //                 onChange={(e) =>
// //                   setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value as any })
// //                 }
// //                 className="w-full border px-2 py-1 rounded"
// //               >
// //                 {["a", "b", "c", "d"].map((opt) => (
// //                   <option key={opt} value={opt}>
// //                     {opt.toUpperCase()}
// //                   </option>
// //                 ))}
// //               </select>
// //             </label>

// //             <label className="block mb-2">
// //               Subject:
// //               <input
// //                 type="text"
// //                 value={editingQuestion.subject}
// //                 onChange={(e) =>
// //                   setEditingQuestion({ ...editingQuestion, subject: e.target.value })
// //                 }
// //                 className="w-full border px-2 py-1 rounded"
// //               />
// //             </label>

// //             <label className="block mb-4">
// //               Difficulty:
// //               <select
// //                 value={editingQuestion.difficulty}
// //                 onChange={(e) =>
// //                   setEditingQuestion({ ...editingQuestion, difficulty: e.target.value })
// //                 }
// //                 className="w-full border px-2 py-1 rounded"
// //               >
// //                 {["VERY EASY", "EASY", "MEDIUM", "HARD", "VERY HARD"].map((diff) => (
// //                   <option key={diff} value={diff}>
// //                     {diff}
// //                   </option>
// //                 ))}
// //               </select>
// //             </label>

// //             <div className="flex justify-end gap-2">
// //               <button
// //                 className="px-4 py-2 rounded bg-gray-300"
// //                 onClick={() => setEditingQuestion(null)}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 className="px-4 py-2 rounded bg-blue-600 text-white"
// //                 onClick={() => handleSaveEdit(editingQuestion)}
// //               >
// //                 Save
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// "use client";

// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { QuizAPI } from "@/lib/api/quiz-api";
// import UploadCSV from "./_components/UploadCSV";
// import QuizTable from "./_components/QuizTable";
// import EditQuestionModal from "./_components/EditQuestion";

// export interface Question {
//   _id: string;
//   questionNumber: number;
//   question: string;
//   options: { a: string; b: string; c: string; d: string };
//   correctAnswer: "a" | "b" | "c" | "d";
//   subject: string;
//   difficulty: string;
// }

// export default function QuizzesPage() {
//   const { loading: authLoading } = useAuth();
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);
//   const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
//   const [loading, setLoading] = useState(false);

//   const fetchQuestions = async () => {
//     setLoading(true);
//     try {
//       const data = await QuizAPI.getQuestions();
//       setQuestions(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();
//   }, []);

//   const handleBatchDelete = async () => {
//     if (!selectedIds.length) return alert("Select questions first!");
//     if (!confirm("Are you sure you want to delete selected questions?")) return;
    
//     try {
//       await QuizAPI.deleteBatchQuestions(selectedIds);
//       setSelectedIds([]);
//       fetchQuestions();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSaveEdit = async (question: Question) => {
//     try {
//       await QuizAPI.updateQuestion(question);
//       setEditingQuestion(null);
//       fetchQuestions();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (authLoading) return <div>Checking session...</div>;

//   return (
//     <div className="p-6 text-black">
//       <h1 className="text-2xl font-bold mb-4">Quiz Questions</h1>
        
//       <UploadCSV 
//         questionsExist={questions.length > 0} 
//         onUploadSuccess={fetchQuestions} 
//       />

//       <div className="flex gap-2 mb-4">
//         <button
//           onClick={handleBatchDelete}
//           disabled={selectedIds.length === 0}
//           className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
//         >
//           Delete Selected
//         </button>
//         <button className="ml-auto bg-green-600 text-white px-4 py-2 rounded">
//           Enable Quiz
//         </button>
//       </div>

//       {loading ? (
//         <div>Loading questions...</div>
//       ) : (
//         <QuizTable
//           questions={questions}
//           selectedIds={selectedIds}
//           onSelectIds={setSelectedIds}
//           onEdit={setEditingQuestion}
//         />
//       )}

//       {editingQuestion && (
//         <EditQuestionModal
//           question={editingQuestion}
//           onClose={() => setEditingQuestion(null)}
//           onSave={handleSaveEdit}
//         />
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { QuizAPI } from "@/lib/api/quiz-api";
import UploadCSV from "./_components/UploadCSV";
import QuizTable from "./_components/QuizTable";
import EditQuestionModal from "./_components/EditQuestion";

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

  const handleBatchDelete = async () => {
    if (!selectedIds.length) return alert("Select questions first!");
    if (!confirm("Are you sure you want to delete selected questions?")) return;

    try {
      await QuizAPI.deleteBatchQuestions(selectedIds);
      setSelectedIds([]);
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
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
    currentPage * questionsPerPage
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
        <button className="ml-auto bg-green-600 text-white px-4 py-2 rounded">
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
                </button>
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
    </div>
  );
}
