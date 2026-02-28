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
   async getQuestionsBySchool(schoolId: string) {
    return await QuestionRepository.findBySchool(schoolId);
  },


  async updateQuestion(
    schoolId: string,
    questionId: string,
    data: {
      question: string;
      options: { a: string; b: string; c: string; d: string };
      correctAnswer: "a" | "b" | "c" | "d";
      subject: string;
      difficulty: "VERY EASY" | "EASY" | "MEDIUM" | "HARD" | "VERY HARD";
    }
  ) {
    const updated = await QuestionModel.findOneAndUpdate(
      { _id: questionId, schoolId },
      data,
      { new: true }
    );

    if (!updated) throw new Error("Question not found");
    return updated;
  },

  async deleteQuestion(schoolId: string, questionId: string) {
    const deleted = await QuestionModel.findOneAndDelete({
      _id: questionId,
      schoolId,
    });
    if (!deleted) throw new Error("Question not found");
    return deleted;
  },

  async deleteBatchQuestions(schoolId: string, questionIds: string[]) {
    const result = await QuestionModel.deleteMany({
      _id: { $in: questionIds },
      schoolId,
    });
    return result.deletedCount;
  },

  async deleteAllQuestionsBySchool(schoolId: string) {
  const result = await QuestionModel.deleteMany({
    schoolId: schoolId,
  });

  return result.deletedCount;
}
};


