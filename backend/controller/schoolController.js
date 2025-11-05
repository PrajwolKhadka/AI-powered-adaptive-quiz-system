import School from "../models/school.js";
import Student from "../models/student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const validateEmail = (email) => {
        return String(email).toLowerCase().match(/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/)
    };
    
export const registerSchool = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) return res.status(400).json({ message: "All fields (email, password, name) are required." });
    if(!validateEmail(email)) return res.status(400).json({message:"The email must be valid"})
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters long." });

    const existing = await School.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const school = new School({ email, password: hashedPassword, name });
    await school.save();

    res.status(201).json({ message: "School registered, awaiting admin approval." });
  } catch (err) {
    console.error(err);
        res.status(500).json({ message: "Internal server error." });
  }
};

export const schoolLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const school = await School.findOne({ email });
    if (!school) return res.status(404).json({ message: "School not found" });
    if (!school.isApproved) return res.status(403).json({ message: "School has not been approved yet" });

    const isMatch = await bcrypt.compare(password, school.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: school._id, role: "school" }, process.env.JWT_SECRET, { expiresIn: "6d" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const addStudent = async (req, res) => {
  try {
    const { username, password, name } = req.body;
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: "Username already exists" });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters long." });
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ username, password: hashedPassword, name, schoolId: req.user._id });
    await student.save();

    res.status(201).json({ message: "Student added", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};
