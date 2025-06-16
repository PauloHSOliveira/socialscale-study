export interface Post {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
}

export interface CreatePostData {
  content: string;
  authorId: string;
}

export interface PostWithPagination {
  posts: Post[];
  nextCursor?: string;
}
