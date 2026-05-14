import { Router } from "express";

import { produtoController } from "../../controllers/produto/ProdutoController";
import { validateRequest } from "../../middlewares/ValidateRequest";
import {
  createProdutoSchema,
  updateProdutoSchema,
} from "../../schema/produto/ProdutoSchema";
import { idParamSchema, nomeParamSchema } from "../../validations/Common";

const produtoRouter = Router();

/**
 * @swagger
 * /api/produtos:
 *   post:
 *     tags: [Produtos]
 *     summary: Criar produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProdutoInput'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Categoria não encontrada
 *       409:
 *         description: Conflito de dados
 */
produtoRouter.post(
  "/",
  validateRequest({ body: createProdutoSchema }),
  (request, response, next) => {
    void produtoController.create(request, response, next);
  },
);

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     tags: [Produtos]
 *     summary: Listar produtos
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
produtoRouter.get("/", (request, response, next) => {
  void produtoController.list(request, response, next);
});

/**
 * @swagger
 * /api/produtos/nome/{nome}:
 *   get:
 *     tags: [Produtos]
 *     summary: Buscar produto por nome
 *     parameters:
 *       - in: path
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Parâmetro inválido
 *       404:
 *         description: Produto não encontrado
 */
produtoRouter.get(
  "/nome/:nome",
  validateRequest({ params: nomeParamSchema }),
  (request, response, next) => {
    void produtoController.findByNome(request, response, next);
  },
);

/**
 * @swagger
 * /api/produtos/{id}:
 *   get:
 *     tags: [Produtos]
 *     summary: Buscar produto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Parâmetro inválido
 *       404:
 *         description: Produto não encontrado
 */
produtoRouter.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  (request, response, next) => {
    void produtoController.findById(request, response, next);
  },
);

/**
 * @swagger
 * /api/produtos/{id}:
 *   put:
 *     tags: [Produtos]
 *     summary: Atualizar produto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProdutoInput'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Produto ou categoria não encontrado
 *       409:
 *         description: Conflito de dados
 */
produtoRouter.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: updateProdutoSchema }),
  (request, response, next) => {
    void produtoController.update(request, response, next);
  },
);

/**
 * @swagger
 * /api/produtos/{id}:
 *   delete:
 *     tags: [Produtos]
 *     summary: Remover produto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do produto
 *     responses:
 *       204:
 *         description: Produto removido com sucesso
 *       400:
 *         description: Parâmetro inválido
 *       404:
 *         description: Produto não encontrado
 */
produtoRouter.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  (request, response, next) => {
    void produtoController.remove(request, response, next);
  },
);

export { produtoRouter };
