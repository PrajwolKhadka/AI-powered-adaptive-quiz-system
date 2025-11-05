import express from "express";
import { adminLogin, approveSchool} from "../controller/adminController.js";
import { adminAuth } from "../middleware/admin.js";

const router = express.Router();

router.post("/login", adminLogin);
router.put("/approveschool/:id", adminAuth, approveSchool);

export default router;
