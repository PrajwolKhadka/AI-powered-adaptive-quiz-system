"use client";
import Image from "next/image";

export default function WhoWeAre() {
  return (
    <section className="py-20 mb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="relative w-full h-90 md:h-115">
            <Image
              src="/images/register.png" 
              alt="Our Team"
              fill
              className="object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Right Text */}
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              About us
            </h2>
            <p className="text-lg text-gray-600">
              We are a team of passionate educators and developers dedicated to
              building adaptive, innovative, and secure educational platforms
              for modern learning environments.
            </p>
            <p className="text-lg text-gray-600">
              Our mission is to empower schools, teachers, and students with
              intuitive tools that make learning interactive, engaging, and
              effective.
            </p>
            <p className="text-lg text-gray-600">
              With years of experience in technology and education, we focus on
              creating solutions that are reliable, user-friendly, and
              accessible to everyone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
