import { database } from "../../config/Database";
import { MovimentacaoEstoque } from "../../models/movimentacao/MovimentacaoEstoque";
import { Produto } from "../../models/produto/Produto";
import { movimentacaoRepository } from "../../repository/movimentacao/MovimentacaoRepository";
import type { CreateMovimentacaoInput } from "../../schema/movimentacao/MovimentacaoSchema";

class MovimentacaoNotFoundError extends Error {}
class MovimentacaoProdutoNotFoundError extends Error {}
class MovimentacaoEstoqueInsuficienteError extends Error {}

class MovimentacaoService {
  private movimentacaoEstoqueEntSai(produto: Produto, tipo: "entrada" | "saida", quantidade: number) {
    const estoqueAtualizado =
      tipo === "entrada"
        ? produto.estoque_disponivel + quantidade
        /*
        Estoque atual: 10
        Entrada: 5
        Novo estoque: 15
        */
        : produto.estoque_disponivel - quantidade;
        /*
        Estoque atual: 15
        Saida: 10
        Novo estoque: 5
        */

    if (estoqueAtualizado < 0) {
      throw new MovimentacaoEstoqueInsuficienteError(
        "Estoque insuficiente para realizar a saída",
      );
    }

    produto.estoque_disponivel = estoqueAtualizado;
  }

  async create(data: CreateMovimentacaoInput) {
    return database.transaction(async (transactionManager) => {
      const produto = await transactionManager.getRepository(Produto).findOne({
        where: { id: data.produto_id },
        relations: {
          categoria: true,
        },
      });

      if (!produto) {
        throw new MovimentacaoProdutoNotFoundError("Produto não encontrado");
      }

      this.movimentacaoEstoqueEntSai(produto, data.tipo, data.quantidade);
      await transactionManager.getRepository(Produto).save(produto);

      const movimentacao = transactionManager.getRepository(MovimentacaoEstoque).create({
        tipo: data.tipo,
        quantidade: data.quantidade,
        observacao: data.observacao,
        produto,
      });

      return transactionManager.getRepository(MovimentacaoEstoque).save(movimentacao);
    });
  }

  list() {
    return movimentacaoRepository.findAll();
  }

  async findById(id: number) {
    const movimentacao = await movimentacaoRepository.findById(id);

    if (!movimentacao) {
      throw new MovimentacaoNotFoundError("Movimentação não encontrada.");
    }

    return movimentacao;
  }

  async remove(id: number) {
    const movimentacao = await this.findById(id);
    await movimentacaoRepository.remove(movimentacao);
  }
}

const movimentacaoService = new MovimentacaoService();

export { MovimentacaoEstoqueInsuficienteError, MovimentacaoNotFoundError,
  MovimentacaoProdutoNotFoundError, movimentacaoService
};
