import { z } from "zod";
import type { CreateResourceInput, UpdateResourceInput } from "../types/resources.types";

export const createResourceDto = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  type: z.enum(["BOOK", "RESOURCE"]),
  format: z.enum(["PDF", "LINK"]),
  linkUrl: z.string().url().optional(),
}) satisfies z.ZodType<Omit<CreateResourceInput, "fileUrl" | "schoolId">>;

export const updateResourceDto = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  type: z.enum(["BOOK", "RESOURCE"]).optional(),
  format: z.enum(["PDF", "LINK"]).optional(),
  linkUrl: z.string().url().optional(),
  fileUrl: z.string().optional(),
}) satisfies z.ZodType<UpdateResourceInput>;

export type CreateResourceDto = z.infer<typeof createResourceDto>;
export type UpdateResourceDto = z.infer<typeof updateResourceDto>;