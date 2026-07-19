import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { badRequest } from "../utils/api-error.js";

export const validate =
    (schema: ZodSchema) =>
    (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            throw badRequest("Invalid request body", result.error.issues);
        }

        req.body = result.data;

        next();
    };

export const validateQuery =
    (schema: ZodSchema) =>
    (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            throw badRequest("Invalid request query", result.error.issues);
        }

        req.query = result.data as Request["query"];

        next();
    };
