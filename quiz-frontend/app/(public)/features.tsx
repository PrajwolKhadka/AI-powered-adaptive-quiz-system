"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    title: "Fast & Reliable",
    icon: "/svgs/bolt.svg",
    bg: "bg-white",
  },
  {
    title: "Secure",
    icon: "/svgs/secure.svg",
    bg: "bg-white",
  },
  {
    title: "Responsive",
    icon: "/svgs/responsive.svg",
    bg: "bg-white",
  },
  {
    title: "Affordable",
    icon: "/svgs/save.svg",
    bg: "bg-white",
  },
   {
    title: "User Friendly",
    icon: "/svgs/friendly.svg",
    bg: "bg-white",
  },
  {
    title: "AI Evaluation",
    icon: "/svgs/evaluation.svg",
    bg: "bg-white",
  },
];

export default function FeaturesFramerScroll() {
  // Duplicate features for seamless looping
  const loopedFeatures = [...features, ...features];

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Maanak?
          </h2>
          <p className="text-lg text-gray-600">
            Built for modern education platforms
          </p>
        </div>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {loopedFeatures.map((feature, index) => (
              <div
                key={index}
                className={`min-w-75 min-h-70 rounded-2xl p-8 shadow-xl ${feature.bg} flex items-center justify-center`}
              >
                <div className="flex flex-col items-center text-center">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={100}
                    height={65}
                    className="mb-10"
                  />
                  <h3 className="text-2xl font-bold text-black mb-4">
                    {feature.title}
                  </h3>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
