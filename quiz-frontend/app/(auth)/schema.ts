import z from "zod";

export const loginSchema = z.object({
    email: z.email({ message: "Enter a valid email" }),
    password: z.string().min(6, { message: "Minimum 6 characters" }),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    schoolName: z.string().min(2, "School name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    contact: z
      .string()
      .regex(/^[0-9]{10}$/, "Contact must be a valid 10-digit number"),
    city: z.string().min(2, "City is required"),
    district: z.string().min(2, "District is required"),
    instituteType: z.enum(["private", "public"]).refine(
      (val) => val === "private" || val === "public",
      { message: "Select institute type" }
    ),
    pan: z
      .string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterData = z.infer<typeof registerSchema>; 