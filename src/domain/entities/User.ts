export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  name: string | null;
  bio: string | null;
  createdAt: Date;
}

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  name?: string | null;
}

export interface UpdateUserData {
  name?: string | null;
  bio?: string | null;
}
