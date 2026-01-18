import { Router } from "express";
import { createStudent } from "../controllers/school.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/create-student", authenticate, createStudent);

export default router;
