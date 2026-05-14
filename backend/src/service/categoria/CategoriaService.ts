import { QueryFailedError } from "typeorm";

import { categoriaRepository } from "../../repository/categoria/CategoriaRepository";
import type {
  CreateCategoriaInput,
  UpdateCategoriaInput,
} from "../../schema/categoria/CategoriaSchema";

class CategoriaConflictError extends Error {}
class CategoriaNotFoundError extends Error {}

const isUniqueConstraintError = (error: unknown): boolean => {
  if (!(error instanceof QueryFailedError)) {
    return false;
  }

  const driverError = error.driverError as { code?: string } | undefined;
  return driverError?.code === "23505";
};

class CategoriaService {
  async create(data: CreateCategoriaInput) {
    const categoria = categoriaRepository.create(data);

    try {
      return await categoriaRepository.save(categoria);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new CategoriaConflictError("Já existe uma categoria com o mesmo nome.");
      }

      throw error;
    }
  }

  list() {
    return categoriaRepository.findAll();
  }

  async findById(id: number) {
    const categoria = await categoriaRepository.findById(id);

    if (!categoria) {
      throw new CategoriaNotFoundError("Categoria não encontrada.");
    }

    return categoria;
  }

  async update(id: number, data: UpdateCategoriaInput) {
    const categoria = await this.findById(id);
    const updateCategoria = categoriaRepository.merge(categoria, data);

    try {
      return await categoriaRepository.save(updateCategoria);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new CategoriaConflictError("Já existe uma categoria com o mesmo nome.");
      }

      throw error;
    }
  }

  async remove(id: number) {
    const categoria = await this.findById(id);
    await categoriaRepository.remove(categoria);
  }
}

const categoriaService = new CategoriaService();

export { CategoriaConflictError, CategoriaNotFoundError, categoriaService };
