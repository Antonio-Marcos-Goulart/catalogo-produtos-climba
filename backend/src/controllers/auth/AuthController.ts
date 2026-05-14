import type { NextFunction, Request, Response } from "express";

import type { LoginInput, RegisterInput } from "../../schema/auth/AuthSchema";
import {
  AuthEmailAlreadyInUseError,
  AuthInvalidCredentialsError,
  AuthUserNotFoundError,
  authService,
} from "../../service/auth/AuthService";

class AuthController {
  async register(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const body = request.body as RegisterInput;
      const usuario = await authService.register(body);

      response.status(201).json(usuario);
    } catch (error) {
      if (error instanceof AuthEmailAlreadyInUseError) {
        response.status(409).json({
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  async login(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const body = request.body as LoginInput;
      const authData = await authService.login(body);

      response.json(authData);
    } catch (error) {
      if (error instanceof AuthInvalidCredentialsError) {
        response.status(401).json({
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  async me(_request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(response.locals.authUser?.userId);
      const usuario = await authService.getUserById(userId);

      response.json(usuario);
    } catch (error) {
      if (error instanceof AuthUserNotFoundError) {
        response.status(404).json({
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }
}

const authController = new AuthController();

export { authController };
