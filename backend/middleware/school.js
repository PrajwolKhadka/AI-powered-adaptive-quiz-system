import jwt from "jsonwebtoken";
import School from "../models/school.js";

export const schoolAuth = async (req, res, next)=>{
    try{
        const token = req.headers.authorization?.split(" ")[1];
        if(!token) return res.status(401).json({message:"No valid token found"});
        

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const school = await School.findById(decode.id);
        if (!school) return res.status(404).json({message:"School not found"});

        req.user = school;
        next();
    }catch(err){
        res.stats(401).json({message: "Illegal Token"});
    }
};