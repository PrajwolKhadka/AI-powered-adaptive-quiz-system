"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RegisterData, registerSchema } from "../schema";
import { handleRegisterSchool } from "@/lib/actions/auth-action";

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const [pending, setTransition] = useTransition();

  const submit = async (values: RegisterData) => {
    setTransition(async () => {
      try {
        const payload = {
          name: values.schoolName,
          email: values.email,
          password: values.password,
          pan: values.pan,
          contactNumber: values.contact,
          instituteType: values.instituteType.toUpperCase(),
          location: {
            city: values.city,
            district: values.district,
          },
        };

        await handleRegisterSchool(payload);
        router.push("/login");
      } catch (err: any) {
        alert(err.message);
      }
    });
  };
  return (
    <form className="space-y-5" onSubmit={handleSubmit(submit)}>
      {/* First row: School Name & Email */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="schoolName"
          >
            School/Institute Name
          </label>
          <input
            id="schoolName"
            type="text"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            {...register("schoolName")}
            placeholder="ABC International School"
          />
          {errors.schoolName?.message && (
            <p className="text-xs text-red-600 mt-1">
              {errors.schoolName.message}
            </p>
          )}
        </div>

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
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            {...register("email")}
            placeholder="school@example.com"
          />
          {errors.email?.message && (
            <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Second row: Contact & Institute Type */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="contact"
          >
            Contact Number
          </label>
          <input
            id="contact"
            type="tel"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            {...register("contact")}
            placeholder="9800000000"
          />
          {errors.contact?.message && (
            <p className="text-xs text-red-600 mt-1">
              {errors.contact.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="instituteType"
          >
            Institute Type
          </label>
          <select
            id="instituteType"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            {...register("instituteType")}
          >
            <option value="">Select institute type</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
          {errors.instituteType?.message && (
            <p className="text-xs text-red-600 mt-1">
              {errors.instituteType.message}
            </p>
          )}
        </div>
      </div>

      {/* Third row: City & District */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="city"
          >
            City
          </label>
          <input
            id="city"
            type="text"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            {...register("city")}
            placeholder="Kathmandu"
          />
          {errors.city?.message && (
            <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="district"
          >
            District
          </label>
          <input
            id="district"
            type="text"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            {...register("district")}
            placeholder="Kathmandu"
          />
          {errors.district?.message && (
            <p className="text-xs text-red-600 mt-1">
              {errors.district.message}
            </p>
          )}
        </div>
      </div>

      {/* PAN */}
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="pan"
        >
          PAN Number
        </label>
        <input
          id="pan"
          type="text"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          {...register("pan")}
          placeholder="ABCDE1234F"
          maxLength={10}
        />
        {errors.pan?.message && (
          <p className="text-xs text-red-600 mt-1">{errors.pan.message}</p>
        )}
      </div>

      {/* Passwords */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            autoComplete="new-password"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            {...register("password")}
            placeholder="••••••••"
          />
          {errors.password?.message && (
            <p className="text-xs text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            {...register("confirmPassword")}
            placeholder="••••••••"
          />
          {errors.confirmPassword?.message && (
            <p className="text-xs text-red-600 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting || pending ? "Creating account..." : "Create account"}
      </button>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
        >
          Log in
        </Link>
      </div>
    </form>
  );
}
