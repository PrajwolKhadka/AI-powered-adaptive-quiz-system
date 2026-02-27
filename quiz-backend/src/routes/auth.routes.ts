import { Router } from "express";
import { changePassword, login, registerSchool, studentLogin,forgotPassword, resetPassword, forgotStudentPassword, resetStudentPassword } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { sendEmail } from "../utils/mailer";

const router = Router();

router.post("/register-school", registerSchool);
router.post("/login", login);
router.post("/student-login", studentLogin);
router.post("/change-password", authenticate, changePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
router.post("/student-forgot-password", forgotStudentPassword);
router.put("/student-reset-password", resetStudentPassword);
// router.get("/test-mail", async (req, res) => {
//   await sendEmail(
//     "prazolkhadka67@gmail.com",
//     "Test Email",
//     "<h2>Nodemailer is working 🎉</h2>"
//   );
//   res.send("Email sent, check inbox!");
// });

export default router;
