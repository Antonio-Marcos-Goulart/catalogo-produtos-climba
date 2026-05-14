import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { authService } from "../service/auth/AuthService";

function authMiddleware(request: Request, response: Response, next: NextFunction): void {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    response.status(401).json({
      message: "Token de acesso nao informado.",
    });
    return;
  }

  const token = authorizationHeader.replace("Bearer ", "").trim();

  try {
    response.locals.authUser = authService.verifyToken(token);
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      response.status(401).json({
        message: "Token invalido ou expirado.",
      });
      return;
    }

    next(error);
  }
}

export { authMiddleware };
