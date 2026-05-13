import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodSchema } from "zod";

type RequestSchemas = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

const getValidationMessage = (error: ZodError): string =>
  error.issues[0]?.message || "Dados invalidos.";

const validateRequest =
  (schemas: RequestSchemas) =>
  (request: Request, response: Response, next: NextFunction): void => {
    if (schemas.params) {
      const result = schemas.params.safeParse(request.params);

      if (!result.success) {
        response.status(400).json({
          message: getValidationMessage(result.error),
        });
        return;
      }
      
      request.params = result.data;
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(request.query);

      if (!result.success) {
        response.status(400).json({
          message: getValidationMessage(result.error),
        });
        return;
      }

      request.query = result.data;
    }

    if (schemas.body) {
      const result = schemas.body.safeParse(request.body);

      if (!result.success) {
        response.status(400).json({
          message: getValidationMessage(result.error),
        });
        return;
      }

      request.body = result.data;
    }

    next();
  };

export { validateRequest };
