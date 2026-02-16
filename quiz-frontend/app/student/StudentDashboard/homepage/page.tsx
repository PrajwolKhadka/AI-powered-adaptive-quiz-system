"use client";

import Image from "next/image";

export default function StudentHomepage() {
  return (
    <div className="min-h-screen bg-gray-50">

      <section className="px-8 py-5 bg-gray-100">
        <div className="max-w-6xl mx-auto bg-blue-300 rounded-3xl shadow-xl px-12 py-10 flex items-center gap-10">
          {/* Left Content */}
          <div className="flex-3 space-y-6">
            <h1 className="text-4xl font-bold text-gray-800 leading-tight">
              “Success is the sum of small efforts repeated daily.”
            </h1>

            <p className="text-gray-700">
              Practice consistently and improve your performance step by step.
            </p>

            <button
              onClick={() => console.log("todo")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition width-200 text-lg font-medium"
            >
              Start Quiz
            </button>
          </div>

          {/* Right Image */}
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

      {/* ================= RESOURCES SECTION ================= */}
      <section className="px-12 pb-16">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Resources</h2>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">Mathematics Notes</h3>
            <p className="text-gray-600 text-sm">
              Important formulas and solved examples.
            </p>
            <button className="mt-4 text-blue-600 font-medium">View →</button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">Science Guide</h3>
            <p className="text-gray-600 text-sm">
              Concept explanations and practice questions.
            </p>
            <button className="mt-4 text-blue-600 font-medium">View →</button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">Previous Questions</h3>
            <p className="text-gray-600 text-sm">
              Practice from previous exam papers.
            </p>
            <button className="mt-4 text-blue-600 font-medium">View →</button>
          </div>
        </div>
      </section>
    </div>
  );
}
