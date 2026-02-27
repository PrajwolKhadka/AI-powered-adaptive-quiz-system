import { Router } from "express";
import { SchoolResultsController } from "../controllers/schoolresults.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { schoolOnly} from "../middlewares/role.middleware";


const router = Router();
const controller = new SchoolResultsController();

router.use(authenticate);
router.use(schoolOnly);

router.get("/quizzes", (req, res) => controller.getSchoolQuizzes(req as any, res));

router.get("/results", (req, res) => controller.getAllResults(req as any, res));

router.get("/quizzes/:quizId/results", (req, res) =>
  controller.getQuizResults(req as any, res)
);

router.get("/quizzes/:quizId/results/:studentId", (req, res) =>
  controller.getStudentResultDetail(req as any, res)
);

export default router;