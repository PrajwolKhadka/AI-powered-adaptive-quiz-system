import { Router } from "express";
import { StudentResultsController } from "../controllers/studentresults.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { studentOnly} from "../middlewares/role.middleware";

const router = Router();
const controller = new StudentResultsController();

router.use(authenticate);
router.use(studentOnly);

router.get("/results", (req, res) => controller.getMyHistory(req as any, res));

router.get("/results/:quizId", (req, res) =>
  controller.getMyResultDetail(req as any, res)
);

export default router;