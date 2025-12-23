import {z} from "zod";

export const superAdminLoginDTO = z.object(
    {
        email: z.string().email(),
        password: z.string().min(6),
    }
);