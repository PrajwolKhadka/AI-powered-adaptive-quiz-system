import express from "express";
import { registerSchool, schoolLogin, addStudent } from "../controller/schoolController";
import { schoolAuth } from "../middleware/school.js";

const router = express.Router();

router.post("/register", registerSchool);
router.post("/login", schoolLogin);
router.post("/addstudent", schoolAuth, addStudent);

export default router;
