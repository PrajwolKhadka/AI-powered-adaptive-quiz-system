import Result from "../models/questions.js";

export const storeResult = async (req, res) =>{
    try{
        const {studentId, score, pyschometricEvaluation} = req.body;
        
        const result = await Result.create({
            studentId,
            score,
            pyschometricEvaluation
        });
        res.status(201).json({message: "Result stored successfully", result});
    }catch(err){
        res.status(500).json({message: "Internal server error"});
    }
};

export const getResultsByStudent = async (req,res) => {
    try{
        const results = await Result.find({studentId: req.params.studentId});
        res.status(200).json({results});
    }catch(err){
        res.status(500).json({message:"Internal server Error"});
    }
};