import { Router } from "express";

import { authController } from "../../controllers/auth/AuthController";
import { authMiddleware } from "../../middlewares/AuthMiddleware";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { loginSchema, registerSchema } from "../../schema/auth/AuthSchema";

const authRouter = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Autenticacao]
 *     summary: Cadastrar usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Usuario cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthUser'
 *       400:
 *         description: Dados invalidos
 *       409:
 *         description: Email ja cadastrado
 */
authRouter.post(
  "/register",
  validateRequest({ body: registerSchema }),
  (request, response, next) => {
    void authController.register(request, response, next);
  },
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Autenticacao]
 *     summary: Realizar login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLoginResponse'
 *       400:
 *         description: Dados invalidos
 *       401:
 *         description: Email ou senha invalidos
 */
authRouter.post(
  "/login",
  validateRequest({ body: loginSchema }),
  (request, response, next) => {
    void authController.login(request, response, next);
  },
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Autenticacao]
 *     summary: Retornar usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthUser'
 *       401:
 *         description: Token invalido ou ausente
 */
authRouter.get(
  "/me",
  authMiddleware,
  (request, response, next) => {
    void authController.me(request, response, next);
  },
);

export { authRouter };
