import type { NextFunction, Request, Response } from "express";

import type {
  CreateCategoriaInput,
  UpdateCategoriaInput,
} from "../../schema/categoria/CategoriaSchema";
import {
  CategoriaConflictError,
  CategoriaNotFoundError,
  categoriaService,
} from "../../service/categoria/CategoriaService";

class CategoriaController {
  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const body = request.body as CreateCategoriaInput;
      const categoria = await categoriaService.create(body);

      response.status(201).json(categoria);
    } catch (error) {
      if (error instanceof CategoriaConflictError) {
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
      const categorias = await categoriaService.list();
      response.json(categorias);
    } catch (error) {
      next(error);
    }
  }

  async findById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const categoria = await categoriaService.findById(Number(request.params.id));

      response.json(categoria);
    } catch (error) {
      if (error instanceof CategoriaNotFoundError) {
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
      const body = request.body as UpdateCategoriaInput;
      const categoriaAtualizada = await categoriaService.update(Number(request.params.id), body);

      response.json(categoriaAtualizada);
    } catch (error) {
      if (error instanceof CategoriaNotFoundError) {
        response.status(404).json({
          message: error.message,
        });
        return;
      }

      if (error instanceof CategoriaConflictError) {
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
      await categoriaService.remove(Number(request.params.id));

      response.status(204).send();
    } catch (error) {
      if (error instanceof CategoriaNotFoundError) {
        response.status(404).json({
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }
}

const categoriaController = new CategoriaController();

export { categoriaController };
