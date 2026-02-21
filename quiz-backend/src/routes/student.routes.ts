import { Router } from "express";
// import { createStudent } from "../controllers/school.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { studentOnly } from "../middlewares/role.middleware";
import { uploads } from "../middlewares/uploads.middleware";
import { getStudentProfile, uploadStudentProfilePicture } from "../controllers/student.controller";
import { StudentQuizController } from "../controllers/studentQuiz.controller";
import { StudentQuizFetchController } from "../controllers/quiz.controller";
import { verifyPassword } from "../controllers/studentVerify.controller";
const quizController = new StudentQuizFetchController();
const controller = new StudentQuizController();
const router = Router();
console.log("Student routes loaded");
router.post("/submit-answer", authenticate, studentOnly, controller.submitAnswer.bind(controller));
router.post("/next-question", authenticate, studentOnly, controller.nextQuestion.bind(controller));

router.put("/profile-picture", authenticate, studentOnly, uploads.single("image"), uploadStudentProfilePicture);
router.get("/profile", authenticate, studentOnly, getStudentProfile);

router.get("/quiz", authenticate, studentOnly, quizController.getQuiz.bind(quizController));
router.get("/active-quiz", authenticate, studentOnly, controller.getActiveQuiz.bind(controller));

router.post("/verify-password", authenticate, studentOnly,verifyPassword);

export default router;
