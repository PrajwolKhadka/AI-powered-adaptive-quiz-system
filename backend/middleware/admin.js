import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

export const adminAuth = async(req, res, next)=>{
    try{
        const token = req.headers.authorization?.split(" ")[1];
        if(!token) return res.status(401).json({message: "No token provided"});

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decode.id);
        if(!admin) return res.status(404).json({message:"Admin not found"});

        req.user= admin;
        next();
    }catch(err){
        res.status(401).json({message: "Illegal toke"});
    }
};