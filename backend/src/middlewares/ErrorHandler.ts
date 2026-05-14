import type { NextFunction, Request, Response } from "express";
import { QueryFailedError } from "typeorm";

function getDatabaseErrorMessage(error: QueryFailedError): string {
  const driverError = error.driverError as { code?: string; detail?: string } | undefined;

  if (driverError?.code === "23503") {
    return "Nao foi possivel remover este registro porque ele possui vinculos ativos.";
  }

  return driverError?.detail || "Erro interno no banco de dados.";
}

function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  if (error instanceof QueryFailedError) {
    response.status(409).json({
      message: getDatabaseErrorMessage(error),
    });
    return;
  }

  if (error instanceof Error) {
    response.status(500).json({
      message: error.message || "Erro interno do servidor.",
    });
    return;
  }

  response.status(500).json({
    message: "Erro interno do servidor.",
  });
}

export { errorHandler };
