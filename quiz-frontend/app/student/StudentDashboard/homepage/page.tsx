"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { QuizAPI } from "@/lib/api/quiz-api";
import { ResourcesAPI } from "@/lib/api/resources-api";
import toast from "react-hot-toast";
interface Resource {
  _id: string;
  title: string;
  description?: string;
  type: "BOOK" | "RESOURCE";
  format: "PDF" | "LINK";
  fileUrl?: string;
  linkUrl?: string;
}

const ITEMS_PER_PAGE = 3;

export default function StudentHomepage() {
  const router = useRouter();

  const handleStartQuiz = async () => {
    try {
      const data = await QuizAPI.getActiveQuiz();

      if (!data.available) {
        toast.error("No Quiz Available at the moment");
        return;
      }

      toast.success(`Quiz available for ${data.subject}!`);
      router.push(`/quiz?quizId=${data.quizId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch quiz");
    }
  };

  const [resources, setResources] = useState<Resource[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await ResourcesAPI.getStudentResources();
      const filtered = Array.isArray(data)
      ? data.filter((r: Resource) => r.type === "RESOURCE")
        : [];
      setResources(filtered);
    } catch (err) {
      console.error("Failed to fetch resources", err);
      setResources([]);
    }
  };

  const totalPages = Math.ceil(resources.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentResources = resources.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleOpenResource = (resource: Resource) => {
    if (resource.format === "LINK" && resource.linkUrl) {
      window.open(resource.linkUrl, "_blank");
    } else if (resource.format === "PDF" && resource.fileUrl) {
      setSelectedPdf(resource.fileUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="px-8 py-5 bg-gray-100">
        <div className="max-w-6xl mx-auto bg-blue-300 rounded-3xl shadow-xl px-12 py-10 flex items-center gap-10">
          <div className="flex-3 space-y-6">
            <h1 className="text-4xl font-bold text-gray-800 leading-tight">
              "Success is the sum of small efforts repeated daily."
            </h1>

            <p className="text-gray-700">
              Practice consistently and improve your performance step by step.
            </p>

            <button
              onClick={handleStartQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition text-lg font-medium"
            >
              Start Quiz
            </button>
          </div>

          <div className="flex-1 flex justify-center">
            <Image
              src="/images/section.png"
              alt="Quiz Illustration"
              width={200}
              height={100}
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <section className="px-12 pb-16 text-black">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Resources</h2>

        {resources.length === 0 ? (
          <p className="text-gray-500">No resources available.</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-6">
              {currentResources.map((resource) => (
                <div
                  key={resource._id}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
                >
                  <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>

                  {resource.description && (
                    <p className="text-gray-600 text-sm">{resource.description}</p>
                  )}

                  <button
                    onClick={() => handleOpenResource(resource)}
                    className="mt-4 text-blue-600 font-medium"
                  >
                    View →
                  </button>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-8">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentPage(index + 1);
                      setSelectedPdf(null);
                    }}
                    className={`px-4 py-2 rounded ${
                      currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {selectedPdf && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-white w-[95%] h-[95%] rounded-2xl relative overflow-hidden">

      <button
        onClick={() => setSelectedPdf(null)}
        className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 z-10"
      >
        Close
      </button>

      <iframe
        src={`${selectedPdf}#toolbar=0`}
        title="PDF Viewer"
        className="w-full h-full"
      />
    </div>
  </div>
)}
      </section>
    </div>
  );
}