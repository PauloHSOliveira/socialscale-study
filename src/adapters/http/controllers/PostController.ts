import type { Response } from "express";
import type { CreatePostUseCase } from "../../../application/use-cases/posts/CreatePostUseCase";
import type { GetPostsUseCase } from "../../../application/use-cases/posts/GetPostsUseCase";
import type { GetUserPostsUseCase } from "../../../application/use-cases/posts/GetUserPostsUseCase";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";
import { ValidationError } from "../../../shared/errors/ValidationError";
import type { AuthRequest } from "../../../shared/types/AuthRequest";
import { BaseController } from "./BaseController";

export class PostController extends BaseController {
  constructor(
    private createPostUseCase: CreatePostUseCase,
    private getPostsUseCase: GetPostsUseCase,
    private getUserPostsUseCase: GetUserPostsUseCase,
  ) {
    super();
  }

  createPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { content } = req.body;

      if (!req.userId) {
        throw new UnauthorizedError("Authentication required");
      }

      const post = await this.createPostUseCase.execute({ content, authorId: req.userId });
      res.status(201).json(post);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const cursor = req.query.cursor as string | undefined;
      const limit = Math.min(Number(req.query.limit) || 20, 100);

      const result = await this.getPostsUseCase.execute(limit, cursor);
      res.json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getUserPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;

      if (!userId) {
        throw new ValidationError("User ID is required");
      }

      const posts = await this.getUserPostsUseCase.execute(userId);
      res.json(posts);
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
