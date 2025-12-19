import express from "express";
import { addQuestion, getQuestions, updateQuestion, deleteQuestion } from "../controller/questionController.js";
import { schoolAuth } from "../middleware/school.js";

const router = express.Router();

router.post("/", schoolAuth, addQuestion);

router.get("/", schoolAuth, getQuestions);

router.put("/:id", schoolAuth, updateQuestion);

router.delete("/:id", schoolAuth, deleteQuestion);

export default router;
