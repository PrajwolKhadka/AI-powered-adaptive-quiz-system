// import express from "express";
// import { authenticate } from "../middleware/auth.js";
// import { createStudent, getStudentsBySchool } from "../models/student.js";

// const router = express.Router();

// // School admin can add students
// router.post("/", authenticate, async (req, res) => {
//   if (req.user.role !== "admin") 
//     return res.status(403).json({ msg: "Only school admins can create students" });

//   const { first_name, last_name, class_name, password } = req.body;
//   try {
//     const student = await createStudent({
//       first_name,
//       last_name,
//       school_id: req.user.school_id, // automatically link to this admin's school
//       class_name,
//       password,
//     });
//     res.json(student);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: err.message });
//   }
// });

// // Get all students of this school
// router.get("/", authenticate, async (req, res) => {
//   if (req.user.role !== "admin") 
//     return res.status(403).json({ msg: "Only school admins can view students" });

//   try {
//     const students = await getStudentsBySchool(req.user.school_id);
//     res.json(students);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: err.message });
//   }
// });

// export default router;

import express from "express";
import { authenticate } from "../middleware/auth.js";
import { createStudent, getStudentsBySchool, updateStudent, deleteStudent } from "../models/student.js";

const router = express.Router();

// Create student
router.post("/", authenticate, async (req, res) => {
  if (req.user.role !== "schooladmin") return res.status(403).json({ msg: "Only school admins can create students" });
  
  const { name, first_name, last_name, class_name, password } = req.body;

  try {
    const student = await createStudent({
      name,
      first_name,
      last_name,
      class_name,
      password,
      school_id: req.user.school_id,
    });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// Get all students
router.get("/", authenticate, async (req, res) => {
  if (req.user.role !== "schooladmin") return res.status(403).json({ msg: "Only school admins can view students" });

  try {
    const students = await getStudentsBySchool(req.user.school_id);
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// Update student
router.put("/:id", authenticate, async (req, res) => {
  if (req.user.role !== "schooladmin") return res.status(403).json({ msg: "Only school admins can update students" });
  
  const { id } = req.params;
  try {
    const updatedStudent = await updateStudent(id, req.user.school_id, req.body);
    if (!updatedStudent) return res.status(404).json({ msg: "Student not found" });
    res.json(updatedStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// Delete student
router.delete("/:id", authenticate, async (req, res) => {
  if (req.user.role !== "schooladmin") return res.status(403).json({ msg: "Only school admins can delete students" });
  
  const { id } = req.params;
  try {
    const deleted = await deleteStudent(id, req.user.school_id);
    if (!deleted) return res.status(404).json({ msg: "Student not found" });
    res.json({ msg: "Student deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

export default router;

