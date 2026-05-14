import { Router } from "express";

import { categoriaController } from "../../controllers/categoria/CategoriaController";
import { validateRequest } from "../../middlewares/ValidateRequest";
import {
  createCategoriaSchema,
  updateCategoriaSchema,
} from "../../schema/categoria/CategoriaSchema";
import { idParamSchema } from "../../validations/Common";

const categoriaRouter = Router();

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     tags: [Categorias]
 *     summary: Criar categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoriaInput'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Categoria já existente
 */
categoriaRouter.post(
  "/",
  validateRequest({ body: createCategoriaSchema }),
  (request, response, next) => {
    void categoriaController.create(request, response, next);
  },
);

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     tags: [Categorias]
 *     summary: Listar categorias
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
categoriaRouter.get("/", (request, response, next) => {
  void categoriaController.list(request, response, next);
});

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     tags: [Categorias]
 *     summary: Buscar categoria por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       400:
 *         description: Parâmetro inválido
 *       404:
 *         description: Categoria não encontrada
 */
categoriaRouter.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  (request, response, next) => {
    void categoriaController.findById(request, response, next);
  },
);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     tags: [Categorias]
 *     summary: Atualizar categoria
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoriaInput'
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Categoria não encontrada
 *       409:
 *         description: Categoria já existente
 */
categoriaRouter.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: updateCategoriaSchema }),
  (request, response, next) => {
    void categoriaController.update(request, response, next);
  },
);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     tags: [Categorias]
 *     summary: Remover categoria
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da categoria
 *     responses:
 *       204:
 *         description: Categoria removida com sucesso
 *       400:
 *         description: Parâmetro inválido
 *       404:
 *         description: Categoria não encontrada
 */
categoriaRouter.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  (request, response, next) => {
    void categoriaController.remove(request, response, next);
  },
);

export { categoriaRouter };
