import { Router } from "express";

import { movimentacaoController } from "../../controllers/movimentacao/MovimentacaoController";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { createMovimentacaoSchema } from "../../schema/movimentacao/MovimentacaoSchema";
import { idParamSchema } from "../../validations/Common";

const movimentacaoRouter = Router();

/**
 * @swagger
 * /api/movimentacoes:
 *   post:
 *     tags: [Movimentações de Estoque]
 *     summary: Criar movimentação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMovimentacaoInput'
 *     responses:
 *       201:
 *         description: Movimentação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movimentacao'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Produto não encontrado
 *       409:
 *         description: Estoque insuficiente
 */
movimentacaoRouter.post(
  "/",
  validateRequest({ body: createMovimentacaoSchema }),
  (request, response, next) => {
    void movimentacaoController.create(request, response, next);
  },
);

/**
 * @swagger
 * /api/movimentacoes:
 *   get:
 *     tags: [Movimentações de Estoque]
 *     summary: Listar movimentações
 *     responses:
 *       200:
 *         description: Lista de movimentações
 */
movimentacaoRouter.get("/", (request, response, next) => {
  void movimentacaoController.list(request, response, next);
});

/**
 * @swagger
 * /api/movimentacoes/{id}:
 *   get:
 *     tags: [Movimentações de Estoque]
 *     summary: Buscar movimentação por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da movimentação
 *     responses:
 *       200:
 *         description: Movimentação encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movimentacao'
 *       400:
 *         description: Parâmetro inválido
 *       404:
 *         description: Movimentação não encontrada
 */
movimentacaoRouter.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  (request, response, next) => {
    void movimentacaoController.findById(request, response, next);
  },
);

/**
 * @swagger
 * /api/movimentacoes/{id}/reverter:
 *   post:
 *     tags: [Movimentações de Estoque]
 *     summary: Reverter movimentação
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da movimentação
 *     responses:
 *       200:
 *         description: Movimentação revertida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movimentacao'
 *       400:
 *         description: Parâmetro inválido
 *       404:
 *         description: Movimentação não encontrada
 *       409:
 *         description: Movimentação já revertida ou estoque insuficiente
 */
movimentacaoRouter.post(
  "/:id/reverter",
  validateRequest({ params: idParamSchema }),
  (request, response, next) => {
    void movimentacaoController.revert(request, response, next);
  },
);

export { movimentacaoRouter };
