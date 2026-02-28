  import { Router } from "express";
  import {  createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    updateStudentPassword,
    deleteStudent,
    deleteBatchStudents, } from "../controllers/school.controller";
  import { toggleQuizController } from "../controllers/quiz.controller";
  import { authenticate } from "../middlewares/auth.middleware";
  import { schoolOnly } from "../middlewares/role.middleware";
  import { uploadCSV } from "../middlewares/csv_uploads.middleware";
  import { deleteAllQuestions, deleteBatchQuestions, deleteQuestion, getQuestions, updateQuestion, uploadQuestionCSV } from "../controllers/question.controller";
  import { uploads } from "../middlewares/uploads.middleware";
  import { uploadStudentProfilePicture } from "../controllers/student.controller";
  const router = Router();
    
  //Student Drama
  router.post("/create-student", authenticate, schoolOnly, uploads.single("image"), createStudent);
  router.get("/students", authenticate, schoolOnly, getStudents);
  router.get("/students/:id", authenticate, schoolOnly, getStudentById);
  router.put("/students/:id",authenticate,schoolOnly,uploads.single("image"),updateStudent);
  router.put("/students/:id/password", authenticate, schoolOnly, updateStudentPassword);
  router.put("/profile-picture", authenticate, schoolOnly, uploads.single("image"), uploadStudentProfilePicture);
  router.delete("/students/:id", authenticate, schoolOnly, deleteStudent);
  router.delete("/students/delete/:ids", authenticate, schoolOnly, deleteStudent);
  router.post("/students/delete-batch", authenticate, schoolOnly, deleteBatchStudents);

  // Question Drama
  router.post("/upload-csv", authenticate,schoolOnly, uploadCSV.single("file"), uploadQuestionCSV);
  router.get("/questions", authenticate, schoolOnly, getQuestions);
  router.put("/questions/:id", authenticate, schoolOnly, updateQuestion);
  router.delete("/questions/delete-all", authenticate, schoolOnly, deleteAllQuestions);
  router.delete("/questions/:id", authenticate, schoolOnly, deleteQuestion);
  router.post("/questions/delete-batch", authenticate, schoolOnly, deleteBatchQuestions);

  //Quiz Drama
  router.post("/quiz/toggle", authenticate, schoolOnly, toggleQuizController);
  
  export default router;
