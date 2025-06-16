import type { CreateFollowData, Follow } from "../../domain/entities/Follow";
import type { FollowRepository } from "../../domain/repositories/FollowRepository";
import { getDatabaseClient } from "../../infrastructure/database/PrismaClient";

export class PrismaFollowRepository implements FollowRepository {
  private prisma = getDatabaseClient();

  async create(data: CreateFollowData): Promise<Follow> {
    return this.prisma.follow.create({ data });
  }

  async findByFollowerAndFollowing(
    followerId: string,
    followingId: string,
  ): Promise<Follow | null> {
    return this.prisma.follow.findFirst({
      where: { followerId, followingId },
    });
  }

  async delete(followerId: string, followingId: string): Promise<void> {
    await this.prisma.follow.deleteMany({
      where: { followerId, followingId },
    });
  }

  async getFollowers(userId: string): Promise<Follow[]> {
    return this.prisma.follow.findMany({
      where: { followingId: userId },
    });
  }

  async getFollowing(userId: string): Promise<Follow[]> {
    return this.prisma.follow.findMany({
      where: { followerId: userId },
    });
  }
}
