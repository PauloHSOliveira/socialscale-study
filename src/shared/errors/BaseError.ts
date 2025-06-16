export abstract class BaseError extends Error {
  abstract readonly statusCode: number;
  abstract readonly name: string;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}
