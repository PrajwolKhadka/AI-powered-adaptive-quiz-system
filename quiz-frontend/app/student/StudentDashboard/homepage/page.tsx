"use client";

import Image from "next/image";
import Link from "next/link";

export default function StudentHomepage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HEADER ================= */}
      <header className="w-full bg-white shadow-sm px-8 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">
          QuizApp
        </div>

        {/* Navigation */}
        <nav className="flex gap-8 text-gray-700 font-medium">
          <Link href="#" className="hover:text-blue-600 transition">
            Homepage
          </Link>
          <Link href="#" className="hover:text-blue-600 transition">
            Books
          </Link>
          <Link href="#" className="hover:text-blue-600 transition">
            Result
          </Link>
        </nav>

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <span className="font-medium">Profile</span>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="px-12 py-16 flex items-center justify-between">
        
        {/* Left Content */}
        <div className="max-w-xl space-y-6">
          <h1 className="text-4xl font-bold text-gray-800">
            “Success is the sum of small efforts repeated daily.”
          </h1>

          <p className="text-gray-600">
            Practice consistently and improve your performance step by step.
          </p>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition">
            Start Quiz
          </button>
        </div>

        {/* Right Image */}
        <div>
          <Image
            src="/quiz-illustration.png" // add image inside public folder
            alt="Quiz Illustration"
            width={400}
            height={300}
          />
        </div>
      </section>

      {/* ================= RESOURCES SECTION ================= */}
      <section className="px-12 pb-16">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Resources
        </h2>

        <div className="grid grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">Mathematics Notes</h3>
            <p className="text-gray-600 text-sm">
              Important formulas and solved examples.
            </p>
            <button className="mt-4 text-blue-600 font-medium">
              View →
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">Science Guide</h3>
            <p className="text-gray-600 text-sm">
              Concept explanations and practice questions.
            </p>
            <button className="mt-4 text-blue-600 font-medium">
              View →
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">Previous Questions</h3>
            <p className="text-gray-600 text-sm">
              Practice from previous exam papers.
            </p>
            <button className="mt-4 text-blue-600 font-medium">
              View →
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
