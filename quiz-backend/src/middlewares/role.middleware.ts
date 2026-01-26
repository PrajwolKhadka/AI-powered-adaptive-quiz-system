import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { Role } from "../types/roles.types";
export const requireSuperAdmin = (
  req: Request & { user?: { role: string } },
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "SUPERADMIN") {
    return res.status(403).json({ error: "SuperAdmin access required" });
  }
  next();
};

export const schoolOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== Role.SCHOOL) {
    return res.status(403).json({ error: "School access only" });
  }
  next();
};

export const studentOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== Role.STUDENT) {
    return res.status(403).json({ error: "Student access only" });
  }
  next();
};
