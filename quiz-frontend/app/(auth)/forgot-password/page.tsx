"use client";

import Image from "next/image";
import LoginForm from "../_components/forgot-password";

export default function Page() {
  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50">
      <div className="flex h-full w-full flex-col md:flex-row">
        <div className="hidden md:flex w-1/3 items-center justify-center p-3 bg-blue-200">
          <div className="relative w-full h-full max-w-lg max-h-120">
            <Image
              src="/images/Frame.png"
              alt="Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <div className="flex-3 flex items-center justify-center p-6 md:p-8 lg:p-12 bg-blue-50">
          <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
            <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left mb-6 text-gray-900">
              Forgot Password?
            </h1>
            <p className="text-sm text-gray-500 mb-6 text-center md:text-left">
              We'll send the reset link to your email so you can choose a new
              password.
            </p>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
