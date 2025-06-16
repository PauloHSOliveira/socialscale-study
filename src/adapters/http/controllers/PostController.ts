import type { Response } from "express";
import type { CreatePostUseCase } from "../../../application/use-cases/posts/CreatePostUseCase";
import type { GetPostsUseCase } from "../../../application/use-cases/posts/GetPostsUseCase";
import type { GetUserPostsUseCase } from "../../../application/use-cases/posts/GetUserPostsUseCase";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";
import { ValidationError } from "../../../shared/errors/ValidationError";
import type { AuthRequest } from "../../../shared/types/AuthRequest";

export class PostController {
  constructor(
    private createPostUseCase: CreatePostUseCase,
    private getPostsUseCase: GetPostsUseCase,
    private getUserPostsUseCase: GetUserPostsUseCase,
  ) {}

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

  private handleError(error: unknown, res: Response): void {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
