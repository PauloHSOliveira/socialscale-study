import type { Request, Response } from "express";
import type { LoginUseCase } from "../../../application/use-cases/auth/LoginUseCase";
import type { SignupUseCase } from "../../../application/use-cases/auth/SignupUseCase";
import { ValidationError } from "../../../shared/errors/ValidationError";
import { BaseController } from "./BaseController";

export class AuthController extends BaseController {
  constructor(
    private signupUseCase: SignupUseCase,
    private loginUseCase: LoginUseCase,
  ) {
    super();
  }

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
}
