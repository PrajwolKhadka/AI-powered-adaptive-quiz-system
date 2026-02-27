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
  const currentResources = resources.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

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
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white">
              "Success is the sum of small efforts repeated daily."
            </h1>
              <span className="block text-blue-600">
                One step at a time.
              </span>
            <p className="text-gray-600 text-lg max-w-xl">
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
      <section className="px-6 py-10 md:px-12 pb-20 text-black bg-gray-100">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-semibold tracking-tight">
              Quiz Preparation
            </h2>
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages || 1}
            </div>
          </div>

          {resources.length === 0 ? (
            <div className=" rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-lg">No resources available.</p>
            </div>
          ) : (
            <>
              {/* Resource Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentResources.map((resource) => (
                  <div
                    key={resource._id}
                    className="group bg-white border border-gray-100 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-medium bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                        {resource.format}
                      </span>

                      <h3 className="font-semibold text-xl mt-4 mb-3 group-hover:text-blue-600 transition">
                        {resource.title}
                      </h3>

                      {resource.description && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {resource.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenResource(resource)}
                      className="mt-6 text-blue-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all"
                    >
                      View Resource →
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-3 mt-12">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentPage(index + 1);
                        setSelectedPdf(null);
                      }}
                      className={`w-10 h-10 rounded-xl transition ${
                        currentPage === index + 1
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* PDF Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-lg">Resource Preview</h3>

              <button
                onClick={() => setSelectedPdf(null)}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm"
              >
                Close
              </button>
            </div>

            <iframe
              src={`${selectedPdf}#toolbar=0`}
              title="PDF Viewer"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}