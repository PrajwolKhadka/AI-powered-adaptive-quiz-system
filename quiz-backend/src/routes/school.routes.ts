import { Router } from "express";
import { createStudent } from "../controllers/school.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { schoolOnly } from "../middlewares/role.middleware";
import { uploadCSV } from "../middlewares/csv_uploads.middleware";
import { uploadQuestionCSV } from "../controllers/question.controller";
const router = Router();

router.post("/create-student", authenticate, createStudent);
router.post("/upload-csv", authenticate,schoolOnly, uploadCSV.single("file"), uploadQuestionCSV);
export default router;
