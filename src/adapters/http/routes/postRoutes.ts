import express from "express";
import { CreatePostUseCase } from "../../../application/use-cases/posts/CreatePostUseCase";
import { GetPostsUseCase } from "../../../application/use-cases/posts/GetPostsUseCase";
import { GetUserPostsUseCase } from "../../../application/use-cases/posts/GetUserPostsUseCase";
import { container } from "../../../infrastructure/di/Container";
import type { PostRepository } from "../../../domain/repositories/PostRepository";
import type { CacheService } from "../../../domain/services/CacheService";
import { PostController } from "../controllers/PostController";
import { authMiddleware } from "../middleware/authMiddleware";
import { expressPostRateLimiter, expressGeneralRateLimiter } from "../middleware/expressRateLimitMiddleware";

export function createPostRoutes(): express.Router {
  const router = express.Router();

  const postRepository = container.resolve<PostRepository>("PostRepository");
  const cacheService = container.resolve<CacheService>("CacheService");

  const createPostUseCase = new CreatePostUseCase(postRepository);
  const getPostsUseCase = new GetPostsUseCase(postRepository, cacheService);
  const getUserPostsUseCase = new GetUserPostsUseCase(postRepository);

  const postController = new PostController(
    createPostUseCase,
    getPostsUseCase,
    getUserPostsUseCase,
  );

  router.post("/", expressPostRateLimiter, authMiddleware, postController.createPost);
  router.get("/", expressGeneralRateLimiter, postController.getPosts);

  return router;
}
