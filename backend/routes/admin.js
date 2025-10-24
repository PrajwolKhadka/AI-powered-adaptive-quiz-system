import express from "express";
import { authenticate } from "../middleware/auth.js";
import { createSchoolAdmin } from "../models/admin.js";

const router = express.Router();

router.post("/create-school-admin", authenticate, async (req, res) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ msg: "Not authorized" });
  }

  const { name, schoolId, password } = req.body;
  const admin = await createSchoolAdmin(name, schoolId, password);
  res.json(admin);
});

export default router;
