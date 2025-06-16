import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { AuthService } from "../../domain/services/AuthService";
import { environment } from "../config/Environment";

export class BcryptAuthService implements AuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(userId: string): string {
    return jwt.sign({ userId }, environment.jwtSecret, { expiresIn: "7d" });
  }

  verifyToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, environment.jwtSecret) as { userId: string };
    } catch {
      return null;
    }
  }
}
