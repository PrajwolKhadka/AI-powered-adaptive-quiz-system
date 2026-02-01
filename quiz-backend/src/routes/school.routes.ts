  import { Router } from "express";
  import {  createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    updateStudentPassword,
    deleteStudent,
    deleteBatchStudents, } from "../controllers/school.controller";
  import { authenticate } from "../middlewares/auth.middleware";
  import { schoolOnly } from "../middlewares/role.middleware";
  import { uploadCSV } from "../middlewares/csv_uploads.middleware";
  import { uploadQuestionCSV } from "../controllers/question.controller";
  import { uploads } from "../middlewares/uploads.middleware";
  import { uploadStudentProfilePicture } from "../controllers/student.controller";
  const router = Router();

  router.post("/create-student", authenticate, schoolOnly, uploads.single("image"), createStudent);
  router.get("/students", authenticate, schoolOnly, getStudents);
  router.get("/students/:id", authenticate, schoolOnly, getStudentById);
  router.put("/students/:id",authenticate,schoolOnly,uploads.single("image"),updateStudent);
  router.put("/students/:id/password", authenticate, schoolOnly, updateStudentPassword);
  router.put("/profile-picture", authenticate, schoolOnly, uploads.single("image"), uploadStudentProfilePicture);
  router.delete("/students/:id", authenticate, schoolOnly, deleteStudent);
  router.delete("/students/delete/:ids", authenticate, schoolOnly, deleteStudent);
  router.post("/students/delete-batch", authenticate, schoolOnly, deleteBatchStudents);

  router.post("/upload-csv", authenticate,schoolOnly, uploadCSV.single("file"), uploadQuestionCSV);
  export default router;
