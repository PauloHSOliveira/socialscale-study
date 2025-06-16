import type { CreatePostData, Post, PostWithPagination } from "../entities/Post";

export interface PostRepository {
  create(data: CreatePostData): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  findByAuthorId(authorId: string): Promise<Post[]>;
  findWithPagination(limit: number, cursor?: string): Promise<PostWithPagination>;
  delete(id: string): Promise<void>;
}
