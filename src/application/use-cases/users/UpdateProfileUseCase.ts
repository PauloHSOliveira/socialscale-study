import type { UpdateUserData, User } from "../../../domain/entities/User";
import type { UserRepository } from "../../../domain/repositories/UserRepository";

export class UpdateProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, data: UpdateUserData): Promise<Omit<User, "password">> {
    const user = await this.userRepository.update(userId, data);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
