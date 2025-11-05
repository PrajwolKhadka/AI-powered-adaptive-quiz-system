import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema({
  schoolId: {type : mongoose.Schema.Types.ObjectId, ref: 'School', required: true},
  firstName: {type : String , required: true},
  lastName: {type : String , required: true},
  username: {type : String , required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, default: "student"},
});

schoolSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("Student", studentSchema);