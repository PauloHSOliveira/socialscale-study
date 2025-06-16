import type { Follow } from "../../../domain/entities/Follow";
import type { FollowRepository } from "../../../domain/repositories/FollowRepository";
import { ConflictError } from "../../../shared/errors/ConflictError";
import { ValidationError } from "../../../shared/errors/ValidationError";

export class FollowUserUseCase {
  constructor(private followRepository: FollowRepository) {}

  async execute(followerId: string, followingId: string): Promise<Follow> {
    if (followerId === followingId) {
      throw new ValidationError("Cannot follow yourself");
    }

    const existingFollow = await this.followRepository.findByFollowerAndFollowing(
      followerId,
      followingId,
    );

    if (existingFollow) {
      throw new ConflictError("Already following this user");
    }

    return this.followRepository.create({ followerId, followingId });
  }
}
