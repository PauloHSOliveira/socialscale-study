import express from "express";
import { LoginUseCase } from "../../../application/use-cases/auth/LoginUseCase";
import { SignupUseCase } from "../../../application/use-cases/auth/SignupUseCase";
import { BcryptAuthService } from "../../../infrastructure/auth/BcryptAuthService";
import { PrismaUserRepository } from "../../db/PrismaUserRepository";
import { AuthController } from "../controllers/AuthController";
import {
  expressLoginRateLimiter,
  expressSignupRateLimiter,
} from "../middleware/expressRateLimitMiddleware";
import { loginSchema, signupSchema, validateBody } from "../middleware/validationMiddleware";

export function createAuthRoutes(): express.Router {
  const router = express.Router();

  const userRepository = new PrismaUserRepository();
  const authService = new BcryptAuthService();

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
