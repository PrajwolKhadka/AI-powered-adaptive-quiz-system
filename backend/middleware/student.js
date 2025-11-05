import jwt from "jsonwebtoken";
import Student from "../models/student.js";

export const studentAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    req.user = student;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
