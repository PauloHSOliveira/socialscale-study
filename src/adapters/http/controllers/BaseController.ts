import type { Response } from "express";
import { ConflictError } from "../../../shared/errors/ConflictError";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError";
import { ValidationError } from "../../../shared/errors/ValidationError";

export abstract class BaseController {
  protected handleError(error: unknown, res: Response): void {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message });
    } else if (error instanceof ConflictError) {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
} 