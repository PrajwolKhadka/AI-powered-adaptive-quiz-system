import { Request, Response } from "express";
import { SchoolRepository } from "../repositories/school.repository";

export const getUnverifiedSchools = async (_: Request, res: Response) => {
  const schools = await SchoolRepository.findUnverified();
  res.json(schools);
};

export const verifySchool = async (req: Request, res: Response) => {
  const { id } = req.params;

  const school = await SchoolRepository.verifyById(id);

  if (!school) {
    return res.status(404).json({ error: "School not found" });
  }

  res.json({
    message: "School verified successfully",
    school,
  });
};