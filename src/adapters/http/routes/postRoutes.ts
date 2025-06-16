import express from "express";
import { CreatePostUseCase } from "../../../application/use-cases/posts/CreatePostUseCase";
import { GetPostsUseCase } from "../../../application/use-cases/posts/GetPostsUseCase";
import { GetUserPostsUseCase } from "../../../application/use-cases/posts/GetUserPostsUseCase";
import { RedisCacheService } from "../../cache/RedisCacheService";
import { PrismaPostRepository } from "../../db/PrismaPostRepository";
import { PostController } from "../controllers/PostController";
import { authMiddleware } from "../middleware/authMiddleware";
import { generalRateLimiter, postRateLimiter } from "../middleware/rateLimiters";

export function createPostRoutes(): express.Router {
  const router = express.Router();

  const postRepository = new PrismaPostRepository();
  const cacheService = new RedisCacheService();

  const createPostUseCase = new CreatePostUseCase(postRepository);
  const getPostsUseCase = new GetPostsUseCase(postRepository, cacheService);
  const getUserPostsUseCase = new GetUserPostsUseCase(postRepository);

  const postController = new PostController(
    createPostUseCase,
    getPostsUseCase,
    getUserPostsUseCase,
  );

  router.post("/", postRateLimiter, authMiddleware, postController.createPost);
  router.get("/", generalRateLimiter, postController.getPosts);

  return router;
}
