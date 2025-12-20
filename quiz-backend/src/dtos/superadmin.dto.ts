import {z} from "zod";

export const superAdminLoginDTO = z.object(
    {
        email: z.email(),
        password: z.string().min(6),
    }
);