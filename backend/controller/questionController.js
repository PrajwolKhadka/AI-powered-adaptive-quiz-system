import Question from "../models/question.js";

export const addQuestion = async (req, res) =>{
    try{
        const {questionText, options, correctAnswer, subject, difficulty} = req.body;

        if(difficulty < 0 || difficulty >4){
            return res.status(400).json({message: "The difficulty must be between 0 and 4"});
        }

        const question = await Question.create({
            school : req.school._id,
            questionText,
            options,
            correctAnswer,
            subject
        });
        res.status(201).json({message: "Question added successfully", question});
    }catch(err){
        res.status(500).json({message: "Internal server error"});
    }
};

export const getQuestions = async (req, res) =>{
    try{
        const questions = await Question.find({schoolId: req.school._id});
        res.status(200).json({questions});
    }catch(err){
        res.status(500).json({message: "Internal server error"});
    }
};

export const updateQuestion = async (req, res) => {
    try{
        const question = await Question.findOne({
            _id: req.params.id,
            schoolId: req.school._id
        });
        if(!question) {
            return res.status(404).json({message: "Question not found"});
        }
        const {questionText, options, correctAnswer, subject, difficulty} = req.body;
        question.questionText = questionText || question.questionText;
        question.options = options || question.options;
        question.correctAnswer = correctAnswer || question.correctAnswer;
        question.subject = subject || question.subject;
        if(difficulty !== undefined){
            if(difficulty < 0 || difficulty > 4){
                return res.status(400).json({message: "The difficulty must be between 0 and 4"});
            }
            question.difficulty = difficulty;
        }
        await question.save();
        res.status(200).json({message: "Question updated successfully",question});
    }catch(err){
        res.status(500).json({message: "Internal server error"});
    }
}

export const deleteQuestion = async (req, res) => {
    try{
        const question = await Question.findOneAndDelete({
            _id : req.params.id,
            schoolId: req.school._id
        });

        if(!question){
            res.status(404).json({message: "Question not found"});
        }

        res.status(200).json({message: "Question deleted successfully"});
    }
    catch(err){
        res.status(500).json({message: "Internal server error"});
    }
};