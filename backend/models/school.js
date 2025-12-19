import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const schoolSchema = new mongoose.Schema({
    name:{type : String , required: true},
    email:{type : String , required: true, unique: true},
    password: {type: String, required: true},
    address: {type: String, required: true },
    pan: {type: String, required: true },
    orgType: {type: String, required: true },
    contact: {type: String, required: true },
    role: {type: String, default: "school"},
    isApproved: {type: Boolean, default: false},
    books:[{filename : String, url: String}],
})
schoolSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default mongoose.model("School", schoolSchema);