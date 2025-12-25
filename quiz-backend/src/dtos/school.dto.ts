import {z} from "zod";
import { InstitueType } from "../types/school.types";

export const registerSchoolDto = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(6),
  location: z.object({
    province: z.string(),
    district: z.string(),
    city: z.string(),
    ward: z.string(),
  }),
  pan: z.string(),
  contactNumber: z.string(),
  instituteType: z.enum(InstitueType),
});
