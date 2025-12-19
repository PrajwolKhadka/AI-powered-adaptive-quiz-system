import express from "express";
import { registerSchool, schoolLogin, changeSchoolPassword,updateSchoolContact,addStudent, updateStudent, deleteStudent } from "../controller/schoolController.js";
import { schoolAuth } from "../middleware/school.js";

const router = express.Router();

router.post("/register", registerSchool);
router.post("/login", schoolLogin);
router.put("/change-password", schoolAuth, changeSchoolPassword);
router.put("/update-contact", schoolAuth, updateSchoolContact);
router.post("/addstudent", schoolAuth, addStudent);
router.put("/student/:studentId", schoolAuth, updateStudent);
router.delete("/student/:studentId", schoolAuth, deleteStudent);

export default router;
