import Student from "../models/student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const studentLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const student = await Student.findOne({ username });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: student._id, role: "student" }, process.env.JWT_SECRET, { expiresIn: "6d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
