import type { UserRepository } from "../../../domain/repositories/UserRepository";
import type { AuthService } from "../../../domain/services/AuthService";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";

export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async execute(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isValidPassword = await this.authService.comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = this.authService.generateToken(user.id);
    return { token };
  }
}
