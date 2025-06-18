import type { PostWithPagination } from "../../../domain/entities/Post";
import type { PostRepository } from "../../../domain/repositories/PostRepository";
import type { CacheService } from "../../../domain/services/CacheService";

export class GetPostsUseCase {
  constructor(
    private postRepository: PostRepository,
    private cacheService: CacheService,
  ) {}

  async execute(limit: number, cursor?: string): Promise<PostWithPagination> {
    const cacheKey = `posts:limit=${limit}${cursor ? `:cursor=${cursor}` : ""}`;

    const cached = await this.cacheService.get<PostWithPagination>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.postRepository.findWithPagination(limit, cursor);
    await this.cacheService.set(cacheKey, result, 10);
    return result;
  }
}
