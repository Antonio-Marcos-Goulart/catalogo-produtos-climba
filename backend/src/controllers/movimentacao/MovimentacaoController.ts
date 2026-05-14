import type { NextFunction, Request, Response } from "express";

import type { CreateMovimentacaoInput } from "../../schema/movimentacao/MovimentacaoSchema";
import {
  MovimentacaoEstoqueInsuficienteError,
  MovimentacaoJaRevertidaError,
  MovimentacaoNotFoundError,
  MovimentacaoProdutoNotFoundError,
  movimentacaoService,
} from "../../service/movimentacao/MovimentacaoService";

class MovimentacaoController {
  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const body = request.body as CreateMovimentacaoInput;
      const movimentacao = await movimentacaoService.create(body);

      response.status(201).json(movimentacao);
    } catch (error) {
      if (error instanceof MovimentacaoProdutoNotFoundError) {
        response.status(404).json({
          message: error.message,
        });
        return;
      }

      if (error instanceof MovimentacaoEstoqueInsuficienteError) {
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
      const movimentacoes = await movimentacaoService.list();
      response.json(movimentacoes);
    } catch (error) {
      next(error);
    }
  }

  async findById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const movimentacao = await movimentacaoService.findById(Number(request.params.id));

      response.json(movimentacao);
    } catch (error) {
      if (error instanceof MovimentacaoNotFoundError) {
        response.status(404).json({
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }

  async revert(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const movimentacaoRevertida = await movimentacaoService.reverterMovimentacao(Number(request.params.id));

      response.json(movimentacaoRevertida);
    } catch (error) {
      if (error instanceof MovimentacaoNotFoundError) {
        response.status(404).json({
          message: error.message,
        });
        return;
      }

      if (error instanceof MovimentacaoJaRevertidaError) {
        response.status(409).json({
          message: error.message,
        });
        return;
      }

      if (error instanceof MovimentacaoEstoqueInsuficienteError) {
        response.status(409).json({
          message: error.message,
        });
        return;
      }

      next(error);
    }
  }
}

const movimentacaoController = new MovimentacaoController();

export { movimentacaoController };
