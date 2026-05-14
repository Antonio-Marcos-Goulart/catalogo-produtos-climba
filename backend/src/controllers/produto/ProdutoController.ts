import type { NextFunction, Request, Response } from "express";

import type {
  CreateProdutoInput,
  UpdateProdutoInput,
} from "../../schema/produto/ProdutoSchema";
import {
  ProdutoCategoriaNotFoundError,
  ProdutoConflictError,
  ProdutoNotFoundError,
  produtoService,
} from "../../service/produto/ProdutoService";

class ProdutoController {
  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const body = request.body as CreateProdutoInput;
      const produto = await produtoService.create(body);

      response.status(201).json(produto);
    } catch (error) {
      if (error instanceof ProdutoCategoriaNotFoundError) {
        response.status(404).json({
          message: error.message,
        });
        return;
      }

      if (error instanceof ProdutoConflictError) {
        response.status(409).json({
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  async list(_request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const produtos = await produtoService.list();
      response.json(produtos);
    } catch (error) {
      next(error);
    }
  }

  async findById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const produto = await produtoService.findById(Number(request.params.id));

      response.json(produto);
    } catch (error) {
      if (error instanceof ProdutoNotFoundError) {
        response.status(404).json({
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  async findByNome(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const produto = await produtoService.findByNomeProduto(String(request.params.nome));

      response.json(produto);
    } catch (error) {
      if (error instanceof ProdutoNotFoundError) {
        response.status(404).json({
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const body = request.body as UpdateProdutoInput;
      const produtoAtualizado = await produtoService.update(Number(request.params.id), body);

      response.json(produtoAtualizado);
    } catch (error) {
      if (error instanceof ProdutoNotFoundError) {
        response.status(404).json({
          message: error.message,
        });
        return;
      }

      if (error instanceof ProdutoCategoriaNotFoundError) {
        response.status(404).json({
          message: error.message,
        });
        return;
      }

      if (error instanceof ProdutoConflictError) {
        response.status(409).json({
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  async remove(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      await produtoService.remove(Number(request.params.id));

      response.status(204).send();
    } catch (error) {
      if (error instanceof ProdutoNotFoundError) {
        response.status(404).json({
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }
}

const produtoController = new ProdutoController();

export { produtoController };
