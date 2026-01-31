import { Schema, model, Types } from "mongoose";

const questionSchema = new Schema(
    {
        questionNumber : {type: Number, required: true},
        question: {type: String, required : true},
        options: {
            a: {type: String, required: true},
            b: {type: String, required: true},
            c: {type: String, required: true},
            d: {type: String, required: true},
        },
        correctAnswer: {
            type: String, 
            enum: ["a", "b", "c", "d"],
            required: true,
        },
        subject: {type: String, required: true},

        difficulty: {
            type: String,
            enum: ["VERY EASY", "EASY", "MEDIUM", "HARD", "VERY HARD"],
            required: true,
        },

        schoolId: {
            type: Types.ObjectId,
            ref: "School",
            required: true,
        },
    },
    {timestamps: true}
);

export const QuestionModel = model("Question", questionSchema);