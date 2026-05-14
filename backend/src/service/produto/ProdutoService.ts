import { QueryFailedError } from "typeorm";

import { categoriaRepository } from "../../repository/categoria/CategoriaRepository";
import { produtoRepository } from "../../repository/produto/ProdutoRepository";
import type {
  CreateProdutoInput,
  UpdateProdutoInput,
} from "../../schema/produto/ProdutoSchema";

class ProdutoConflictError extends Error {}
class ProdutoNotFoundError extends Error {}
class ProdutoCategoriaNotFoundError extends Error {}

const isUniqueConstraintError = (error: unknown): boolean => {
  if (!(error instanceof QueryFailedError)) {
    return false;
  }

  const driverError = error.driverError as { code?: string } | undefined;
  return driverError?.code === "23505";
};

class ProdutoService {
  private async validateCategoriaExists(categoriaId: number) {
    const categoria = await categoriaRepository.findById(categoriaId);

    if (!categoria) {
      throw new ProdutoCategoriaNotFoundError("Categoria não encontrada");
    }
  }

  async create(data: CreateProdutoInput) {
    await this.validateCategoriaExists(data.categoria_id);

    const produto = produtoRepository.create(data);

    try {
      return await produtoRepository.save(produto);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ProdutoConflictError("Já existe um produto com os mesmos dados");
      }

      throw error;
    }
  }

  list() {
    return produtoRepository.findAll();
  }

  async findById(id: number) {
    const produto = await produtoRepository.findById(id);

    if (!produto) {
      throw new ProdutoNotFoundError("Produto não encontrado.");
    }

    return produto;
  }

  async findByNomeProduto(nome_produto: string) {
    const produto = await produtoRepository.findByNome(nome_produto);

    if (!produto) {
      throw new ProdutoNotFoundError("Produto não encontrado.");
    }

    return produto;
  }

  async update(id: number, data: UpdateProdutoInput) {
    const produto = await this.findById(id);

    if (data.categoria_id !== undefined) {
      await this.validateCategoriaExists(data.categoria_id);
    }

    const updateProduto = produtoRepository.merge(produto, data);

    try {
      return await produtoRepository.save(updateProduto);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ProdutoConflictError("Já existe um produto com os mesmos dados");
      }

      throw error;
    }
  }

  async remove(id: number) {
    const produto = await this.findById(id);
    await produtoRepository.remove(produto);
  }
}

const produtoService = new ProdutoService();

export {
  ProdutoCategoriaNotFoundError,
  ProdutoConflictError,
  ProdutoNotFoundError,
  produtoService,
};
