"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { handleResetPassword } from "@/lib/actions/auth-action";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [message, setMessage] = useState<string | null>(null);

  const submit = async (data: ResetPasswordData) => {
    try {
       const res = await handleResetPassword({ token, newPassword: data.newPassword });

      if (res.success) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setMessage(res.message || "Invalid or expired token");
      }
    } catch (err: any) {
      setMessage(err.message || "Network error");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">New Password</label>
        <input
          type="password"
          placeholder="••••••••"
           className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
          {...register("newPassword")}
        />
        {errors.newPassword?.message && <p className="text-xs text-red-600">{errors.newPassword.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? "Resetting..." : "Reset Password"}
      </button>

      {message && (
        <div className="mt-3 rounded bg-green-50 px-4 py-2 text-green-700 text-sm">{message}</div>
      )}
    </form>
  );
}
