import mongoose from "mongoose";

const resultSchema = new mongoose.schema({
  studentId : {type: mongoose.Schema.Types.ObjectId, ref : 'Student', required : true},
  score : {type : int, required: true},
  pyschometricEvaluation : {type : String , required : false},
})

export default mongoose.model("Result", resultSchema);