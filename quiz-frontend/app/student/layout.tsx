"use client";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { getProfile } from "@/lib/api/student-api";
import { Toaster } from "react-hot-toast";
interface Student {
  id: string;
  fullName: string;
  email: string;
  imageUrl?: string;
}

export default function StudentDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setStudent(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="w-full bg-white shadow-sm px-7 py-4 flex items-center justify-between">
        <div className="flex items-center gap-115 ">
          <Link href="/student/StudentDashboard/homepage">
            <Image
              src="/images/logo.png"
              alt="App Logo"
              width={120}
              height={40}
              className="object-contain cursor-pointer"
              priority
            />
          </Link>

          <nav className="flex gap-16 text-black font-medium">
            <Link href="/student/StudentDashboard/homepage">Homepage</Link>
            <Link href="/student/StudentDashboard/books">Books</Link>
            <Link href="/student/StudentDashboard/result">Result</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 cursor-pointer">
          <Link href="/student/StudentDashboard/profile" className="flex items-center gap-3">
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          ) : student?.imageUrl ? (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${student.imageUrl}`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
              {student?.fullName?.charAt(0) || "?"}
            </div>
          )}
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded m-4">
            {error}
          </div>
        )}
        {children}
        <Toaster position="top-right" />
      </main>
    </div>
  );
}
