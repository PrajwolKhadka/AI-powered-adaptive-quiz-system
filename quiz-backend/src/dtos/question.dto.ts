import {z} from "zod";

export const questionCsvRowDto = z.object({
    questionNumber : z.coerce.number(),
    question: z.string().min(5),

    optionA : z.string().min(1),
    optionB : z.string().min(1),
    optionC : z.string().min(1),
    optionD : z.string().min(1),

    rightAnswer : z.enum(["a", "b", "c", "d"]),
    subject: z.string(),
    difficulty: z.enum(["VERY EASY", "EASY", "MEDIUM", "HARD", "VERY HARD"]),
});

export type QuestionCsvRow = z.infer<typeof questionCsvRowDto>;