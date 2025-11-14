import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    schoolId: {type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true},
    question: {type: String, required: true},
    correctAnswer : {type: String, required: true},
    difficulty : {type : Number , enum : [0,1,2,3,4], default : 0},
    createdAt: {type: Date, default: Date.now()},
})

export default mongoose.model("Question", questionSchema);