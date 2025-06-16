import type { NextFunction, Response } from "express";
import { BcryptAuthService } from "../../../infrastructure/auth/BcryptAuthService";
import type { AuthRequest } from "../../../shared/types/AuthRequest";

const authService = new BcryptAuthService();

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded = authService.verifyToken(token);

  if (!decoded) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  req.userId = decoded.userId;
  next();
};
