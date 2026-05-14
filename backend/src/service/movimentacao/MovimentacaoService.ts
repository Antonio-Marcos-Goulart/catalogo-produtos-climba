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
  private isMovimentacaoDeReversao(observacao?: string): boolean {
    if (!observacao) {
      return false;
    }

    const normalizedValue = observacao
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    return normalizedValue.startsWith("reversao da movimentacao ");
  }

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
        "Estoque insuficiente para realizar a saida",
      );
    }

    produto.estoque_disponivel = estoqueAtualizado;
  }

  private tipoReverso(tipo: "entrada" | "saida"): "entrada" | "saida" {
    return tipo === "entrada" ? "saida" : "entrada";
  }

  async create(data: CreateMovimentacaoInput) {
    return database.transaction(async (transactionManager) => {
      const produtoRepository = transactionManager.getRepository(Produto);
      const movimentacaoEstoqueRepository =
        transactionManager.getRepository(MovimentacaoEstoque);

      const produto = await produtoRepository.findOne({
        where: { id: data.produto_id },
        lock: {
          mode: "pessimistic_write",
        },
      });

      if (!produto) {
        throw new MovimentacaoProdutoNotFoundError("Produto nao encontrado.");
      }

      this.movimentacaoEstoqueEntSai(produto, data.tipo, data.quantidade);
      await produtoRepository.save(produto);

      const movimentacao = movimentacaoEstoqueRepository.create({
        tipo: data.tipo,
        quantidade: data.quantidade,
        observacao: data.observacao,
        revertida: false,
        produto,
      });

      return movimentacaoEstoqueRepository.save(movimentacao);
    });
  }

  list() {
    return movimentacaoRepository.findAll();
  }

  async findById(id: number) {
    const movimentacao = await movimentacaoRepository.findById(id);

    if (!movimentacao) {
      throw new MovimentacaoNotFoundError("Movimentacao nao encontrada.");
    }

    return movimentacao;
  }

  async reverterMovimentacao(id: number) {
    return database.transaction(async (transactionManager) => {
      const movimentacaoEstoqueRepository =
        transactionManager.getRepository(MovimentacaoEstoque);
      const produtoRepository = transactionManager.getRepository(Produto);

      const movimentacao = await movimentacaoEstoqueRepository.findOne({
        where: { id },
        lock: {
          mode: "pessimistic_write",
        },
      });

      if (!movimentacao) {
        throw new MovimentacaoNotFoundError("Movimentacao nao encontrada.");
      }

      if (movimentacao.revertida) {
        throw new MovimentacaoJaRevertidaError("Essa movimentacao ja foi revertida.");
      }

      if (this.isMovimentacaoDeReversao(movimentacao.observacao)) {
        throw new MovimentacaoJaRevertidaError(
          "Movimentacoes de reversao nao podem ser revertidas novamente.",
        );
      }

      const produto = await produtoRepository.findOne({
        where: { id: movimentacao.produtoId },
        lock: {
          mode: "pessimistic_write",
        },
      });

      if (!produto) {
        throw new MovimentacaoProdutoNotFoundError("Produto nao encontrado.");
      }

      const tipoReverso = this.tipoReverso(movimentacao.tipo);
      this.movimentacaoEstoqueEntSai(
        produto,
        tipoReverso,
        movimentacao.quantidade,
      );

      await produtoRepository.save(produto);

      movimentacao.revertida = true;
      await movimentacaoEstoqueRepository.save(movimentacao);

      const observacaoReversao = movimentacao.observacao
        ? `Reversao da movimentacao ${movimentacao.id}. Observacao original: ${movimentacao.observacao}`
        : `Reversao da movimentacao ${movimentacao.id}.`;

      const novaMovimentacao = movimentacaoEstoqueRepository.create({
        tipo: tipoReverso,
        quantidade: movimentacao.quantidade,
        observacao: observacaoReversao,
        revertida: false,
        produto,
      });

      return movimentacaoEstoqueRepository.save(novaMovimentacao);
    });
  }
}

const movimentacaoService = new MovimentacaoService();

export {
  MovimentacaoEstoqueInsuficienteError,
  MovimentacaoJaRevertidaError,
  MovimentacaoNotFoundError,
  MovimentacaoProdutoNotFoundError,
  movimentacaoService,
};
