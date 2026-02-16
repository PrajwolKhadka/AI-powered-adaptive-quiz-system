"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { changePassword } from "@/lib/api/student-api";
import { useAuth } from "@/context/AuthContext";

export default function ChangePasswordPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!loading && (!user || user.isFirstLogin === false)) {
      router.replace("/student/StudentDashboard/homepage");
    }
  }, [user, loading, router]);

  const handleChange = async () => {
    if (!newPassword.trim()) {
      setError("Password cannot be empty");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await changePassword(newPassword);

      setSuccess(true);

      setTimeout(() => {
        router.replace("/student/StudentDashboard/homepage");
      }, 1500);
    } catch (err: any) {
      console.error("Error changing password:", err);
      setError(err.response?.data?.message || "Failed to change password");
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !submitting && !success) {
      handleChange();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user || user.isFirstLogin === false) {
    return null;
  }

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 pt-45">
      <div className="bg-white p-8 rounded-xl shadow-md w-110 space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            Change Your Password
          </h2>
          <p className="text-sm text-gray-600">
            Please set a new password for your account
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={submitting || success}
            autoFocus
          />
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Password changed successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleChange}
          disabled={submitting || success || !newPassword.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {success
            ? "Redirecting..."
            : submitting
              ? "Updating..."
              : "Update Password"}
        </button>
      </div>
    </div>
  );
}
