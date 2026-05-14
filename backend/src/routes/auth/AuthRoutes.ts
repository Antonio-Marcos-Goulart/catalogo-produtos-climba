import { Router } from "express";

import { authController } from "../../controllers/auth/AuthController";
import { authMiddleware } from "../../middlewares/AuthMiddleware";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { loginSchema } from "../../schema/auth/AuthSchema";

const authRouter = Router();

authRouter.post(
  "/login",
  validateRequest({ body: loginSchema }),
  (request, response, next) => {
    void authController.login(request, response, next);
  },
);

authRouter.get(
  "/me",
  authMiddleware,
  (request, response, next) => {
    void authController.me(request, response, next);
  },
);

export { authRouter };
