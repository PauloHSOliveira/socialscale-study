import type { Response } from "express";
import type { GetUserPostsUseCase } from "../../../application/use-cases/posts/GetUserPostsUseCase";
import { ValidationError } from "../../../shared/errors/ValidationError";
import type { AuthRequest } from "../../../shared/types/AuthRequest";
import { BaseController } from "./BaseController";

export class UserPostController extends BaseController {
  constructor(private getUserPostsUseCase: GetUserPostsUseCase) {
    super();
  }

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