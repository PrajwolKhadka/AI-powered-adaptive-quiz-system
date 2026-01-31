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
}
