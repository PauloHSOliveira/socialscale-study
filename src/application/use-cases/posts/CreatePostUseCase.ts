import type { CreatePostData, Post } from "../../../domain/entities/Post";
import type { PostRepository } from "../../../domain/repositories/PostRepository";

export class CreatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(data: CreatePostData): Promise<Post> {
    return this.postRepository.create(data);
  }
}
