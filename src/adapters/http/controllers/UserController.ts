import type { Response } from "express";
import type { FollowUserUseCase } from "../../../application/use-cases/users/FollowUserUseCase";
import type { UpdateProfileUseCase } from "../../../application/use-cases/users/UpdateProfileUseCase";
import { ConflictError } from "../../../shared/errors/ConflictError";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";
import { ValidationError } from "../../../shared/errors/ValidationError";
import type { AuthRequest } from "../../../shared/types/AuthRequest";

export class UserController {
  constructor(
    private updateProfileUseCase: UpdateProfileUseCase,
    private followUserUseCase: FollowUserUseCase,
  ) {}

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

  private handleError(error: unknown, res: Response): void {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message });
    } else if (error instanceof ConflictError) {
      res.status(409).json({ error: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
