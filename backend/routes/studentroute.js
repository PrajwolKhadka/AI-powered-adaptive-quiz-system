import express from "express";
import { studentLogin } from "../controllers/studentController.js";
import { studentAuth } from "../middleware/student.js";

const router = express.Router();
router.post("/login", studentLogin);
router.get("/profile", studentAuth, (req, res) => {
  res.json({ student: req.user });
});

export default router;
