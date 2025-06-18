import express from "express";
import { LoginUseCase } from "../../../application/use-cases/auth/LoginUseCase";
import { SignupUseCase } from "../../../application/use-cases/auth/SignupUseCase";
import { container } from "../../../infrastructure/di/Container";
import type { AuthService } from "../../../domain/services/AuthService";
import type { UserRepository } from "../../../domain/repositories/UserRepository";
import { AuthController } from "../controllers/AuthController";
import {
  expressLoginRateLimiter,
  expressSignupRateLimiter,
} from "../middleware/expressRateLimitMiddleware";
import { loginSchema, signupSchema, validateBody } from "../middleware/validationMiddleware";

export function createAuthRoutes(): express.Router {
  const router = express.Router();

  const userRepository = container.resolve<UserRepository>("UserRepository");
  const authService = container.resolve<AuthService>("AuthService");

  const signupUseCase = new SignupUseCase(userRepository, authService);
  const loginUseCase = new LoginUseCase(userRepository, authService);

  const authController = new AuthController(signupUseCase, loginUseCase);

  router.post(
    "/signup",
    expressSignupRateLimiter,
    validateBody(signupSchema),
    authController.signup,
  );

  router.post("/login", expressLoginRateLimiter, validateBody(loginSchema), authController.login);

  return router;
}
