import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
  readonly statusCode = 401;
  readonly name = "UnauthorizedError";

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
