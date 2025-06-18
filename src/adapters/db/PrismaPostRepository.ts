import type { Prisma } from "@prisma/client";
import type { CreatePostData, Post, PostWithPagination } from "../../domain/entities/Post";
import type { PostRepository } from "../../domain/repositories/PostRepository";
import { getDatabaseClient } from "../../infrastructure/database/PrismaClient";

export class PrismaPostRepository implements PostRepository {
  private prisma = getDatabaseClient();

  async create(data: CreatePostData): Promise<Post> {
    return this.prisma.post.create({ data });
  }

  async findById(id: string): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async findByAuthorId(authorId: string): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: { authorId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findWithPagination(limit: number, cursor?: string): Promise<PostWithPagination> {
    const queryOptions: Prisma.PostFindManyArgs = {
      orderBy: { createdAt: "desc" },
      take: limit + 1,
    };

    if (cursor) {
      queryOptions.cursor = { id: cursor };
      queryOptions.skip = 1;
    }

    const posts = await this.prisma.post.findMany(queryOptions);

    let nextCursor: string | undefined = undefined;
    if (posts.length > limit) {
      const lastPost = posts.pop();
      if (lastPost) {
        nextCursor = lastPost.id;
      }
    }

    return { posts, nextCursor };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.post.delete({ where: { id } });
  }
}
