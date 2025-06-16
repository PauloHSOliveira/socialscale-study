import type { Request, Response } from "express";
import type { LoginUseCase } from "../../../application/use-cases/auth/LoginUseCase";
import type { SignupUseCase } from "../../../application/use-cases/auth/SignupUseCase";
import { ConflictError } from "../../../shared/errors/ConflictError";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";
import { ValidationError } from "../../../shared/errors/ValidationError";

export class AuthController {
  constructor(
    private signupUseCase: SignupUseCase,
    private loginUseCase: LoginUseCase,
  ) {}

  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name, username } = req.body;

      if (!email || !password || !username) {
        throw new ValidationError("Email, password and username are required");
      }

      const result = await this.signupUseCase.execute({ email, password, name, username });
      res.status(201).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ValidationError("Email and password are required");
      }

      const result = await this.loginUseCase.execute(email, password);
      res.json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof ConflictError) {
      res.status(409).json({ error: error.message });
    } else if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
