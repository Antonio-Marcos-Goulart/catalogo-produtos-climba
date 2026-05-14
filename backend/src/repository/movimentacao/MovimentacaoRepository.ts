import { database } from "../../config/Database";
import { MovimentacaoEstoque } from "../../models/movimentacao/MovimentacaoEstoque";
import { Produto } from "../../models/produto/Produto";
import { CreateMovimentacaoInput,UpdateMovimentacaoInput, } from "../../schema/movimentacao/MovimentacaoSchema";

class MovimentacaoRepository {
  private get repository() {
    return database.getRepository(MovimentacaoEstoque);
  }

  create(data: CreateMovimentacaoInput): MovimentacaoEstoque {
    const { produto_id, ...movimentacaoData } = data;

    return this.repository.create({
      ...movimentacaoData,
      produto: { id: produto_id } as Produto,
    });
  }

  save(movimentacao: MovimentacaoEstoque): Promise<MovimentacaoEstoque> {
    return this.repository.save(movimentacao);
  }

  findById(id: number): Promise<MovimentacaoEstoque | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        produto: true,
      },
    });
  }

  findAll(): Promise<MovimentacaoEstoque[]> {
    return this.repository.find({
      relations: {
        produto: true,
      },
      order: {
        dataMovimentacao: "DESC",
      },
    });
  }

  merge(
    movimentacao: MovimentacaoEstoque,
    data: UpdateMovimentacaoInput,
  ): MovimentacaoEstoque {
    const { produto_id, ...movimentacaoData } = data;

    return Object.assign(movimentacao, {
      ...movimentacaoData,
      tipo: data.tipo ?? movimentacao.tipo,
      quantidade: data.quantidade ?? movimentacao.quantidade,
      observacao: data.observacao ?? movimentacao.observacao,
      produto: produto_id ? ({ id: produto_id } as Produto) : movimentacao.produto,
    });
  }

  remove(movimentacao: MovimentacaoEstoque): Promise<MovimentacaoEstoque> {
    return this.repository.remove(movimentacao);
  }
}

export { MovimentacaoRepository };
