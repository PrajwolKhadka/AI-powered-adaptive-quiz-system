import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  res.status(err.statusCode || 400).json({
    error: err.message || "Something went wrong",
  });
};
