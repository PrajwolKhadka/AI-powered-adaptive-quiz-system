import { Request, Response, NextFunction } from "express";

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
