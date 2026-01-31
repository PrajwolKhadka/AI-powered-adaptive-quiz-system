import fs from "fs";
import csv from "csv-parser";
import { QuestionModel } from "../models/questions.model";
import { questionCsvRowDto } from "../dtos/question.dto";
import { QuestionRepository } from "../repositories/question.repository";

interface CSVUploadResult {
  inserted: number;
  failed: number;
  errors: any[];
}

export const QuestionService = {
  async uploadQuestionsFromCSV(
    filePath: string,
    schoolId: string,
  ): Promise<CSVUploadResult> {
    const questions: any[] = [];
    const errors: any[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({mapHeaders: ({header}) => header.replace(/^\uFEFF/, '')}))
        .on("data", (row) => {
          try {
            const parsed = questionCsvRowDto.parse({
              questionNumber: row["question number"],
              question: row["question"],
              optionA: row["option a"],
              optionB: row["option b"],
              optionC: row["option c"],
              optionD: row["option d"],
              rightAnswer: row["right answer"].toLowerCase(),
              subject: row["subject"],
              difficulty: row["difficulty"].toUpperCase(),
            });

            questions.push({
              questionNumber: parsed.questionNumber,
              question: parsed.question,
              options: {
                a: parsed.optionA,
                b: parsed.optionB,
                c: parsed.optionC,
                d: parsed.optionD,
              },
              correctAnswer: parsed.rightAnswer,
              subject: parsed.subject,
              difficulty: parsed.difficulty,
              schoolId,
            });
          } catch (err: any) {
            errors.push({ row, error: err.errors });
          }
        })
        .on("end", async () => {
          if (questions.length) {
            await QuestionRepository.insertMany(questions);
          }

          fs.unlinkSync(filePath);

          resolve({
            inserted: questions.length,
            failed: errors.length,
            errors,
          });
        })
        .on("error", reject);
    });
  },
};
