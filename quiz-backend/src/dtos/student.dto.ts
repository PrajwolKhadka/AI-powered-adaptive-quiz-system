import { z } from "zod";

export const CreateStudentDTO = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters").trim(),

  email: z.string().email("Invalid email format"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  className: z.string().min(1, "Class is required"),

  imageUrl: z.string().optional(),
});

export type CreateStudentDto = z.infer<typeof CreateStudentDTO>;

export const uploadProfilePictureDto = z.object({});

export type UploadProfilePictureDto = z.infer<typeof uploadProfilePictureDto>;
