import { Router } from "express";
// import { createStudent } from "../controllers/school.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { studentOnly } from "../middlewares/role.middleware";
import { uploads } from "../middlewares/uploads.middleware";
import { uploadStudentProfilePicture } from "../controllers/student.controller";

const router = Router();

router.put("/profile-picture", authenticate, studentOnly, uploads.single("image"), uploadStudentProfilePicture);

export default router;
