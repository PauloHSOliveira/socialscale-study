export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface CreateFollowData {
  followerId: string;
  followingId: string;
}
