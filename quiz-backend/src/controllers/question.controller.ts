import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { QuestionService } from "../services/question.service";

export const uploadQuestionCSV = async(
    req: AuthRequest,
    res: Response
) => {
    try{
        if(!req.file){
            return res.status(400).json({error: "CSV file is required"});
        }
        const result = await QuestionService.uploadQuestionsFromCSV(
            req.file.path,
            req.user!.id
        );

        res.status(201).json({
            message: "CSV processed successfully",
            ...result,
        });
    }catch(err: any){
        res.status(500).json({error: err.message});
    }
};
export const getQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const questions = await QuestionService.getQuestionsBySchool(req.user!.id);
    res.status(200).json({ questions });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await QuestionService.updateQuestion(
      req.user!.id,
      req.params.id,
      req.body
    );
    res.status(200).json({ message: "Question updated", question: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteQuestion = async (req: AuthRequest, res: Response) => {
  try {
    await QuestionService.deleteQuestion(req.user!.id, req.params.id);
    res.status(200).json({ message: "Question deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBatchQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const deletedCount = await QuestionService.deleteBatchQuestions(
      req.user!.id,
      req.body.questionIds
    );
    res
      .status(200)
      .json({ message: `${deletedCount} questions deleted` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};