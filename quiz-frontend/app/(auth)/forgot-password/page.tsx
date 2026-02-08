// "use client";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useState } from "react";
// import { handleForgotPassword } from "@/lib/actions/auth-action";

// const forgotPasswordSchema = z.object({
//   email: z.string().email("Invalid email address"),
// });

// type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

// export default function ForgotPasswordForm() {
//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordData>({
//     resolver: zodResolver(forgotPasswordSchema),
//   });

//   const [message, setMessage] = useState<string | null>(null);

//   const submit = async (data: ForgotPasswordData) => {
//     try {
//       const res = await handleForgotPassword(data);

//       if (res.success) setMessage(res.message || "Check your email for reset link");
//       else setMessage(res.message || "Something went wrong");
//     } catch (err: any) {
//       setMessage(err.message || "Network error");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(submit)} className="space-y-5">
//       <h2 className="text-xl font-semibold">Forgot Password</h2>

//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700">Email Address</label>
//         <input
//           type="email"
//           placeholder="school@example.com"
//           className="w-full rounded-lg border px-4 py-2"
//           {...register("email")}
//         />
//         {errors.email?.message && <p className="text-xs text-red-600">{errors.email.message}</p>}
//       </div>

//       <button
//         type="submit"
//         disabled={isSubmitting}
//         className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
//       >
//         {isSubmitting ? "Sending..." : "Send Reset Link"}
//       </button>

//       {message && (
//         <div className="mt-3 rounded bg-green-50 px-4 py-2 text-green-700 text-sm">{message}</div>
//       )}
//     </form>
//   );
// }

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
