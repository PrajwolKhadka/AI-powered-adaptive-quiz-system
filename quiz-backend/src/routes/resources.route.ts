import { Router } from "express";
import multer from "multer";
import { authenticate } from "../middlewares/auth.middleware";
import { schoolOnly, studentOnly } from "../middlewares/role.middleware";
import {
  createResource,
  getStudentResources,
  getSchoolResources,
  updateResource,
  deleteResource,
} from "../controllers/resource.controller";
import { pdfUpload } from "../middlewares/pdf_uploads.middleware";

const router = Router();

// SCHOOL ROUTES
router.post(
  "/upload-resources",
  authenticate,
  schoolOnly,
  pdfUpload.single("file"),
  createResource,
);

router.get("/get-resources", authenticate, schoolOnly, getSchoolResources);

router.put("/:id", authenticate, schoolOnly, pdfUpload.single("file") ,updateResource);

router.delete("/:id", authenticate, schoolOnly, deleteResource);

// STUDENT ROUTE
router.get("/student-resources", authenticate, studentOnly, getStudentResources);

export default router;
