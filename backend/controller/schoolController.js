import School from "../models/school.js";
import Student from "../models/student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const validateEmail = (email) => {
        return String(email).toLowerCase().match(/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/)
    };
    
export const registerSchool = async (req, res) => {
  try {
    const { email, password, name , address, pan, orgType, contact} = req.body;

    if (!email || !password || !name) return res.status(400).json({ message: "All fields (email, password, name) are required." });
    if(!validateEmail(email)) return res.status(400).json({message:"The email must be valid"})
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters long." });

    const existing = await School.findOne({ email });
    const existingContact = await School.findOne({ contact });
    if (existing) return res.status(400).json({ message: "Email already exists" });
    if(existingContact) return res.status(400).json({message: "Contact number already in use"});
    const hashedPassword = await bcrypt.hash(password, 10);
    const school = new School({ email, password: hashedPassword, name , address, pan, orgType, contact});
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

export const changeSchoolPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const school = await School.findById(req.user.id);

    if (!school) return res.status(404).json({ message: "School not found" });

    const match = await bcrypt.compare(oldPassword, school.password);
    if (!match) return res.status(400).json({ message: "Old password incorrect" });

    if (newPassword.length < 8)
      return res.status(400).json({ message: "New password must be at least 8 characters" });

    school.password = await bcrypt.hash(newPassword, 10);
    await school.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updateSchoolContact = async (req, res) => {
  try {
    const { contact } = req.body;

    if (!contact)
      return res.status(400).json({ message: "Contact number required" });

    const existing = await School.findOne({ contact });
    if (existing && existing._id.toString() !== req.user.id)
      return res.status(400).json({ message: "Contact already in use" });

    const school = await School.findByIdAndUpdate(
      req.user.id,
      { contact },
      { new: true }
    );

    res.json({ message: "Contact updated", school });
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



export const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updated = await Student.findOneAndUpdate(
      { _id: studentId, schoolId: req.user.id },
      updates,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Student not found or unauthorized." });

    res.json({ message: "Student updated", updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const deleted = await Student.findOneAndDelete({
      _id: studentId,
      schoolId: req.user.id,
    });

    if (!deleted)
      return res.status(404).json({ message: "Student not found or unauthorized." });

    res.json({ message: "Student deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};