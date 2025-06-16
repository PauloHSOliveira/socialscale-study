import type { Post } from "../../../domain/entities/Post";
import type { PostRepository } from "../../../domain/repositories/PostRepository";

export class GetUserPostsUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(userId: string): Promise<Post[]> {
    return this.postRepository.findByAuthorId(userId);
  }
}
