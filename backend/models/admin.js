import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  email: {type : String, unique: true, required: true},
  password: {type: String, required: true},
  role: {type: String, default: "superadmin"},
})

adminSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("Admin",adminSchema);