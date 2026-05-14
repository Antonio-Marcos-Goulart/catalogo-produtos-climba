import { database } from "../../config/Database";
import { MovimentacaoEstoque } from "../../models/movimentacao/MovimentacaoEstoque";
import { Produto } from "../../models/produto/Produto";
import { movimentacaoRepository } from "../../repository/movimentacao/MovimentacaoRepository";
import type { CreateMovimentacaoInput } from "../../schema/movimentacao/MovimentacaoSchema";

class MovimentacaoNotFoundError extends Error {}
class MovimentacaoProdutoNotFoundError extends Error {}
class MovimentacaoEstoqueInsuficienteError extends Error {}
class MovimentacaoJaRevertidaError extends Error {}

class MovimentacaoService {
  private movimentacaoEstoqueEntSai(
    produto: Produto,
    tipo: "entrada" | "saida",
    quantidade: number,
  ) {
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

  private tipoReverso(tipo: "entrada" | "saida"): "entrada" | "saida" {
    return tipo === "entrada" ? "saida" : "entrada";
  }

  async create(data: CreateMovimentacaoInput) {
    return database.transaction(async (transactionManager) => { // salva tudo ou nada 
      const produto = await transactionManager.getRepository(Produto).findOne({
        where: { id: data.produto_id },
        relations: {
          categoria: true,
        },
      });

      if (!produto) {
        throw new MovimentacaoProdutoNotFoundError("Produto não encontrado.");
      }

      this.movimentacaoEstoqueEntSai(produto, data.tipo, data.quantidade);
      await transactionManager.getRepository(Produto).save(produto);

      const movimentacao = transactionManager.getRepository(MovimentacaoEstoque).create({
        tipo: data.tipo,
        quantidade: data.quantidade,
        observacao: data.observacao,
        revertida: false,
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

  async reverterMovimentacao(id: number) {
    return database.transaction(async (transactionManager) => {
      const movimentacao = await transactionManager.getRepository(MovimentacaoEstoque).findOne({
        where: { id },
        relations: {
          produto: {
            categoria: true,
          },
        },
      });

      if (!movimentacao) {
        throw new MovimentacaoNotFoundError("Movimentação não encontrada.");
      }

      if (movimentacao.revertida) {
        throw new MovimentacaoJaRevertidaError("Essa movimentação já foi revertida.");
      }

      const tipoReverso = this.tipoReverso(movimentacao.tipo);
      this.movimentacaoEstoqueEntSai(
        movimentacao.produto,
        tipoReverso,
        movimentacao.quantidade,
      );

      await transactionManager.getRepository(Produto).save(movimentacao.produto);

      movimentacao.revertida = true;
      await transactionManager.getRepository(MovimentacaoEstoque).save(movimentacao);

      const observacaoReversao = movimentacao.observacao
        ? `Reversão da movimentação ${movimentacao.id}. Observação original: ${movimentacao.observacao}`
        : `Reversão da movimentação ${movimentacao.id}.`;

      const novaMovimentacao = transactionManager.getRepository(MovimentacaoEstoque).create({
        tipo: tipoReverso,
        quantidade: movimentacao.quantidade,
        observacao: observacaoReversao,
        revertida: false,
        produto: movimentacao.produto,
      });

      return transactionManager.getRepository(MovimentacaoEstoque).save(novaMovimentacao);
    });
  }
}

const movimentacaoService = new MovimentacaoService();

export {
  MovimentacaoEstoqueInsuficienteError, MovimentacaoJaRevertidaError, 
  MovimentacaoNotFoundError, MovimentacaoProdutoNotFoundError, 
  movimentacaoService
};
