"use client";
import Image from "next/image";
import Link from "next/link";
import FeaturesStacked from "./features";
import WhoWeAre from "./whoarewe";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role === "SCHOOL") router.replace("/school/dashboard");
      else if (user.role === "STUDENT") router.replace("/student/dashboard");
    }
  }, [isAuthenticated, loading, user]);
  return (
    <div className="mx-auto bg-linear-to-br from-blue-200 via-white to-blue-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-10">
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-block">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={210}
                  height={50}
                  className="mx-auto lg:mx-0"
                />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Let's Build Future{" "}
                <span className="bg-clip-text text-blue-500">Together</span>
              </h1>
            
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Explore our platform to manage quiz, resources, and students
                seamlessly. Interactive, secure, and optimized for modern
                education.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="group relative px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:scale-105"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Get Started
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Link>

                <Link
                  href="/login"
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  Login
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative w-full h-80 md:h-120">
              <Image
                src="/images/landing.png"
                alt="Platform Preview"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>
      {/*who are we*/}
      <WhoWeAre/>
      {/* Features Section */}
     <FeaturesStacked/>

      {/* CTA Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-blue-700"></div>
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Join us into the future through our platform for a better tomorrow.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 hover:shadow-2xl hover:scale-105"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
}
