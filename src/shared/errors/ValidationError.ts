import { BaseError } from "./BaseError";

export class ValidationError extends BaseError {
  readonly statusCode = 400;
  readonly name = "ValidationError";

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
