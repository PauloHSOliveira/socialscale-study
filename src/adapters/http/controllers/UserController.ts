import type { Response } from "express";
import type { FollowUserUseCase } from "../../../application/use-cases/users/FollowUserUseCase";
import type { UpdateProfileUseCase } from "../../../application/use-cases/users/UpdateProfileUseCase";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";
import { ValidationError } from "../../../shared/errors/ValidationError";
import type { AuthRequest } from "../../../shared/types/AuthRequest";
import { BaseController } from "./BaseController";

export class UserController extends BaseController {
  constructor(
    private updateProfileUseCase: UpdateProfileUseCase,
    private followUserUseCase: FollowUserUseCase,
  ) {
    super();
  }

  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { name, bio } = req.body;

      if (!req.userId) {
        throw new UnauthorizedError("Authentication required");
      }

      const user = await this.updateProfileUseCase.execute(req.userId, { name, bio });
      res.json(user);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  followUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const followingId = req.params.id;

      if (!req.userId) {
        throw new UnauthorizedError("Authentication required");
      }

      if (!followingId) {
        throw new ValidationError("User ID to follow is required");
      }

      const follow = await this.followUserUseCase.execute(req.userId, followingId);
      res.status(201).json(follow);
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
