import type { CreateUserData, User } from "../../../domain/entities/User";
import type { UserRepository } from "../../../domain/repositories/UserRepository";
import type { AuthService } from "../../../domain/services/AuthService";
import { ConflictError } from "../../../shared/errors/ConflictError";

export class SignupUseCase {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async execute(data: CreateUserData): Promise<{ user: Omit<User, "password">; token: string }> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError("Email already in use");
    }

    const existingUsername = await this.userRepository.findByUsername(data.username);
    if (existingUsername) {
      throw new ConflictError("Username already in use");
    }

    const hashedPassword = await this.authService.hashPassword(data.password);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const token = this.authService.generateToken(user.id);
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }
}
