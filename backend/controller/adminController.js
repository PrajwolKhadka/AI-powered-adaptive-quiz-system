import Admin from "../models/admin.js";
import School from "../models/school.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
    try{
        const { email, password } = req.body;
        const admin = await Admin.findOne({email});
        if(!admin) return res.status(404).json({message : "Admin not found"});
        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch) return res.status(400).json({message: "Invalid Password"});

        const token = jwt.sign(
            {
                id: admin._id, role: admin.role
            },
            process.env.JWT_SECRET,
            {expiresIn:"6d"}
        );

        res.json({token});
        }catch(err){
            res.status(500).json({message: err.message});
    }
};

export const approveSchool = async (req, res) => {
    try{
        const school = await School.findById(req.params.id);
        if(!school) return res.status(404).json({message: "School Unavailable"});

        school.isApproved = true;
        await school.save();

        res.json({message: "School approved successfully"});
    }catch(err){
        res.status(500).json({message: err.message});
    }
};
