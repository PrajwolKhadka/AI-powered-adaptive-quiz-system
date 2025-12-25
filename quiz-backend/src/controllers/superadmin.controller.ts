import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";

export const getUnverifiedSchools = async (_: Request, res: Response) => {
  const schools = await AdminService.getUnverifiedSchools();
  res.json(schools);
};
export const getVerifiedSchools = async (_: Request, res: Response) => {
  const schools = await AdminService.getVerifiedSchools();
  res.json(schools);
};
export const verifySchool = async (req: Request, res: Response) => {
  const { id } = req.params;

  const school = await AdminService.verifySchool(id);

  if (!school) {
    return res.status(404).json({ error: "School not found" });
  }

  res.json({
    message: "School verified successfully",
    school,
  });
};

export const rejectSchool = async (req: Request, res: Response) => {
  const { id } = req.params;

  const school = await AdminService.rejectSchool(id);

  if (!school) {
    return res.status(404).json({ error: "School not found" });
  }

  res.json({
    message: "School rejected successfully",
    school,
  });
};
