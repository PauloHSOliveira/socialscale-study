import type { NextFunction, Request, Response } from "express";

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    console.log(`[${res.statusCode}] ${req.method} ${req.originalUrl}`);
  });
  next();
};
