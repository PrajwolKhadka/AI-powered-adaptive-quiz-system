import { Router } from "express";
import { changePassword, login, registerSchool, studentLogin } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register-school", registerSchool);
router.post("/login", login);
router.post("/student-login", studentLogin);
router.post("/change-password", authenticate, changePassword);

export default router;
