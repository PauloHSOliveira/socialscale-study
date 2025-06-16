import type { CreateFollowData, Follow } from "../entities/Follow";

export interface FollowRepository {
  create(data: CreateFollowData): Promise<Follow>;
  findByFollowerAndFollowing(followerId: string, followingId: string): Promise<Follow | null>;
  delete(followerId: string, followingId: string): Promise<void>;
  getFollowers(userId: string): Promise<Follow[]>;
  getFollowing(userId: string): Promise<Follow[]>;
}
