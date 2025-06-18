import express from "express";
import { GetUserPostsUseCase } from "../../../application/use-cases/posts/GetUserPostsUseCase";
import { FollowUserUseCase } from "../../../application/use-cases/users/FollowUserUseCase";
import { UpdateProfileUseCase } from "../../../application/use-cases/users/UpdateProfileUseCase";
import type { FollowRepository } from "../../../domain/repositories/FollowRepository";
import type { PostRepository } from "../../../domain/repositories/PostRepository";
import type { UserRepository } from "../../../domain/repositories/UserRepository";
import { container } from "../../../infrastructure/di/Container";
import { PostController } from "../controllers/PostController";
import { UserController } from "../controllers/UserController";
import { UserPostController } from "../controllers/UserPostController";
import { authMiddleware } from "../middleware/authMiddleware";
import { expressGeneralRateLimiter } from "../middleware/expressRateLimitMiddleware";

export function createUserRoutes(): express.Router {
  const router = express.Router();

  const userRepository = container.resolve<UserRepository>("UserRepository");
  const followRepository = container.resolve<FollowRepository>("FollowRepository");
  const postRepository = container.resolve<PostRepository>("PostRepository");

  const updateProfileUseCase = new UpdateProfileUseCase(userRepository);
  const followUserUseCase = new FollowUserUseCase(followRepository);
  const getUserPostsUseCase = new GetUserPostsUseCase(postRepository);

  const userController = new UserController(updateProfileUseCase, followUserUseCase);
  const userPostController = new UserPostController(getUserPostsUseCase);

  router.put("/profile", expressGeneralRateLimiter, authMiddleware, userController.updateProfile);
  router.post("/follow/:id", expressGeneralRateLimiter, authMiddleware, userController.followUser);
  router.get(
    "/:id/posts",
    expressGeneralRateLimiter,
    authMiddleware,
    userPostController.getUserPosts,
  );

  return router;
}
