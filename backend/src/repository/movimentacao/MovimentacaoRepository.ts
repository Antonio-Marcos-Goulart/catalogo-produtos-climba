import { database } from "../../config/Database";
import { MovimentacaoEstoque } from "../../models/movimentacao/MovimentacaoEstoque";
import { Produto } from "../../models/produto/Produto";
import { CreateMovimentacaoInput } from "../../schema/movimentacao/MovimentacaoSchema";

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
  remove(movimentacao: MovimentacaoEstoque): Promise<MovimentacaoEstoque> {
    return this.repository.remove(movimentacao);
  }
}

const movimentacaoRepository = new MovimentacaoRepository();

export { MovimentacaoRepository, movimentacaoRepository };
