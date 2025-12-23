import { Router } from "express";
import {getUnverifiedSchools,verifySchool,rejectSchool, getVerifiedSchools} from "../controllers/superadmin.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireSuperAdmin } from "../middlewares/role.middleware";

const router = Router();

//SUPERADMIN chahinxa yaa bata
router.use(authenticate, requireSuperAdmin);

router.get("/schools/unverified", getUnverifiedSchools);
router.get("/schools/verified", getVerifiedSchools);
router.patch("/schools/:id/verify", verifySchool);
router.patch("/schools/:id/reject", rejectSchool);

export default router;
