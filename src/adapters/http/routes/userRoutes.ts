import express from "express";
import { GetUserPostsUseCase } from "../../../application/use-cases/posts/GetUserPostsUseCase";
import { FollowUserUseCase } from "../../../application/use-cases/users/FollowUserUseCase";
import { UpdateProfileUseCase } from "../../../application/use-cases/users/UpdateProfileUseCase";
import { RedisCacheService } from "../../cache/RedisCacheService";
import { PrismaFollowRepository } from "../../db/PrismaFollowRepository";
import { PrismaPostRepository } from "../../db/PrismaPostRepository";
import { PrismaUserRepository } from "../../db/PrismaUserRepository";
import { PostController } from "../controllers/PostController";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middleware/authMiddleware";
import { generalRateLimiter } from "../middleware/rateLimiters";
import { ValidationError } from "../../../shared/errors/ValidationError";
import type { Response } from "express";
import type { AuthRequest } from "../../../shared/types/AuthRequest";
import { GetPostsUseCase } from "../../../application/use-cases/posts/GetPostsUseCase";
import { CreatePostUseCase } from "../../../application/use-cases/posts/CreatePostUseCase";

export function createUserRoutes(): express.Router {
  const router = express.Router();

  const userRepository = new PrismaUserRepository();
  const followRepository = new PrismaFollowRepository();
  const postRepository = new PrismaPostRepository();
  const cacheService = new RedisCacheService();

  const updateProfileUseCase = new UpdateProfileUseCase(userRepository);
  const followUserUseCase = new FollowUserUseCase(followRepository);
  const getUserPostsUseCase = new GetUserPostsUseCase(postRepository);
  const createPostUseCase = new CreatePostUseCase(postRepository);
  const getPostsUseCase = new GetPostsUseCase(postRepository, cacheService);

  const userController = new UserController(updateProfileUseCase, followUserUseCase);
  const postController = new PostController(createPostUseCase, getPostsUseCase, getUserPostsUseCase);
  

  router.put("/profile", generalRateLimiter, authMiddleware, userController.updateProfile);
  router.post("/follow/:id", generalRateLimiter, authMiddleware, userController.followUser);
  router.get("/:id/posts", generalRateLimiter, authMiddleware, postController.getUserPosts);

  return router;
}
