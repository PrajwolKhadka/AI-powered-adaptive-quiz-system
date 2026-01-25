import {z} from "zod";

export const loginDto = z.object({
    email : z.email(),
    password: z.string().min(8),
})

export const changePasswordDto = z.object({
    newPassword: z.string().min(8),
})