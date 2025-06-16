import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { ValidationError } from "../../../shared/errors/ValidationError";

export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.parse(req.body);
      req.body = result;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        next(new ValidationError(message));
      } else {
        next(error);
      }
    }
  };
}

export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.parse(req.query);
      // Express query is always Record<string, string | string[] | undefined>
      // After validation, we know it matches our schema T, but we need to preserve
      // the Express query type structure for compatibility
      Object.assign(req.query, result);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        next(new ValidationError(message));
      } else {
        next(error);
      }
    }
  };
}

// Common validation schemas
export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3).max(20),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createPostSchema = z.object({
  content: z.string().min(1).max(280),
});

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  bio: z.string().max(160).optional(),
});

export const paginationSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(Number(val), 100) : 20)),
  cursor: z.string().optional(),
});
