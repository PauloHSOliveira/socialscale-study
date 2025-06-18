import type { NextFunction, Response } from "express";
import { container } from "../../../infrastructure/di/Container";
import type { AuthService } from "../../../domain/services/AuthService";
import type { AuthRequest } from "../../../shared/types/AuthRequest";

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authService = container.resolve<AuthService>("AuthService");
  
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
