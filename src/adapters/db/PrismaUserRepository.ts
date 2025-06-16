import type { CreateUserData, UpdateUserData, User } from "../../domain/entities/User";
import type { UserRepository } from "../../domain/repositories/UserRepository";
import { getDatabaseClient } from "../../infrastructure/database/PrismaClient";

export class PrismaUserRepository implements UserRepository {
  private prisma = getDatabaseClient();

  async create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
