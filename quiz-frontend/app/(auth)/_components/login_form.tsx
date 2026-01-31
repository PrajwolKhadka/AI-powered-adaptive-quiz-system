"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginSchema, LoginData } from "../schema";
import { handleLoginSchool } from "@/lib/actions/auth-action";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const [pending, setTransition] = useTransition();
  const [authError, setAuthError] = useState<string | null>(null);

  const submit = async (values: LoginData) => {
    setAuthError(null);
    setTransition(async () => {
      try {
        console.log("Login values:", values);

        const res = await handleLoginSchool(values);

        if (res.success) {
          console.log("Login response:", res);
          router.push("/auth/dashboard");
        } else {
          console.log("Login response:", res);
          setAuthError(res.message || "Invalid credentials");
        }
      } catch (err: any) {
        setAuthError(err?.message || "Invalid credentials");
      }
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(submit)}>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="email"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="school@example.com"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          {...register("email")}
        />
        {errors.email?.message && (
          <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          {...register("password")}
        />
        {errors.password?.message && (
          <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
        )}
      </div>
      {authError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {authError}
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting || pending ? "Logging in..." : "Log in"}
      </button>

      <div className="flex justify-between text-sm text-gray-600">
        <Link
          href="/forgot-password"
          className="text-blue-600 hover:text-blue-700 hover:underline"
        >
          Forgot password?
        </Link>

        <span>
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign up
          </Link>
        </span>
      </div>
    </form>
  );
}
