"use client";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="mx-auto bg-linear-to-br from-blue-200 via-white to-blue-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-block">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={200}
                  height={50}
                  className="mx-auto lg:mx-0"
                />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Let's Build Future{" "}
                <span className="bg-clip-text text-blue-500">
                  Together
                </span>
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
            <div className="relative w-full h-80 md:h-96">
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

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your educational institution
              efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 ">
            {/* Feature 1 */}
            <div className="group relative  bg-green-300 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-16 h-16 mb-6 mx-auto">
                <Image
                  src="/svgs/bolt.svg"
                  alt="Fast & Reliable"
                  width={65}
                  height={65}
                />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 text-justify">
                Fast & Reliable
              </h3>
              <p className="text-gray-900 text-justify">
                Experience fast performance and reliable data handling with our
                optimized infrastructure.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative  bg-blue-400 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-16 h-16 mb-6 mx-auto">
                <Image
                  src="/svgs/secure.svg"
                  alt="Secure"
                  width={65}
                  height={65}
                />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 text-justify">Secure</h3>
              <p className="text-gray-900 text-justify">
                Your data is safe with end-to-end encryption and secure servers
                protecting every transaction.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-indigo-400 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-16 h-16 mb-6 mx-auto">
                <Image
                  src="/svgs/responsive.svg"
                  alt="Responsive"
                  width={65}
                  height={65}
                />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 text-justify">
                Responsive
              </h3>
              <p className="text-gray-900 text-justify">
                Works seamlessly on all devices, from phones to desktops with
                adaptive design.
              </p>
            </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-blue-700"></div>
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Animated circles */}

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Join hundreds of schools and institutes using our platform to manage
            their operations efficiently.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 hover:shadow-2xl hover:scale-105"
          >
            Create Your Account
            <svg
              className="w-6 h-6 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
