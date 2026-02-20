import { z } from "zod";

export const toggleQuizDto = z.object({
  quizId: z.string().optional(),
  classLevel: z.number().min(6).max(12),
  subject: z.enum(["Computer Sc.", "Science", "Maths", "Nepali", "English", "Social", "EPH"]),
  durationMinutes: z.number().min(1).max(60),
  isActive: z.boolean(),
});

export type ToggleQuizInput = z.infer<typeof toggleQuizDto>;


export const getQuizDto = z.object({
  quizId: z.string(),
});

export type GetQuizInput = z.infer<typeof getQuizDto>;