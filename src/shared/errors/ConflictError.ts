import { BaseError } from "./BaseError";

export class ConflictError extends BaseError {
  readonly statusCode = 409;
  readonly name = "ConflictError";

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
