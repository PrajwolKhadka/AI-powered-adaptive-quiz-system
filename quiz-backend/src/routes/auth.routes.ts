import { Router } from "express";
import { login, registerSchool } from "../controllers/auth.controller";

const router = Router();

router.post("/register-school", registerSchool);
router.post("/login", login);

export default router;
