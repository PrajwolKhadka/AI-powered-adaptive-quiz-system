"use client";

import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="relative w-80 h-80">
        <Image
          src="/images/logo.png"
          alt="Dashboard Placeholder"
          fill
          className="object-contain"
        />
      </div>
      <h1 className="text-black text-2xl font-bold ">
        Dashboard
      </h1>
    </div>
  );
}
