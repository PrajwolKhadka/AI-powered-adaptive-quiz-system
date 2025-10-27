import express from "express";
import { authenticate } from "../middleware/auth.js";
import { 
  createSchoolAdmin, 
  getAllSchoolAdmins, 
  deleteSchoolAdmin, 
  resetSchoolAdminPassword,
  updateSchoolAdmin
} from "../models/admin.js";

const router = express.Router();

// Create a new school admin
router.post("/admins", authenticate, async (req, res) => {
  if (req.user.role !== "superadmin") return res.status(403).json({ msg: "Not authorized" });

  const { name, schoolId, password } = req.body;
  const admin = await createSchoolAdmin(name, schoolId, password);
  res.json(admin);
});

// Get all school admins
router.get("/admins", authenticate, async (req, res) => {
  if (req.user.role !== "superadmin") return res.status(403).json({ msg: "Not authorized" });

  const admins = await getAllSchoolAdmins();
  res.json(admins);
});

// Delete a school admin
router.delete("/admins/:id", authenticate, async (req, res) => {
  if (req.user.role !== "superadmin") return res.status(403).json({ msg: "Not authorized" });

  const { id } = req.params;
  await deleteSchoolAdmin(parseInt(id));
  res.json({ msg: "Admin deleted successfully" });
});

// router.put("/admins/:id/reset", authenticate, async (req, res) => {
//   try {
//     if (req.user.role !== "superadmin") return res.status(403).json({ msg: "Not authorized" });

//     const { id } = req.params;
//     const updatedAdmin = await resetSchoolAdminPassword(parseInt(id));
//     res.json(updatedAdmin);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Failed to reset password" });
//   }
// });
router.put("/admins/:id/reset", authenticate, async (req, res) => {
  if (req.user.role !== "superadmin") 
    return res.status(403).json({ msg: "Not authorized" });

  const { id } = req.params;
  const { password } = req.body;

  try {
    const updatedAdmin = await resetSchoolAdminPassword(parseInt(id), password);
    res.json({ msg: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put("/admins/:id", authenticate, async (req, res) => {
  if (req.user.role !== "superadmin") 
    return res.status(403).json({ msg: "Not authorized" });

  const { id } = req.params;
  const { name, schoolId } = req.body;

  try {
    const updatedAdmin = await updateSchoolAdmin(parseInt(id), name, schoolId);
    res.json(updatedAdmin);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


export default router;
