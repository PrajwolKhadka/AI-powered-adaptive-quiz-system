import { Router } from "express";
import { loginSuperAdmin } from "../controllers/superadminauth.controller";

const router = Router();
router.post("/login", loginSuperAdmin);

export default router;