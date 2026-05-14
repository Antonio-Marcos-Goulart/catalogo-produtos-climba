import { database } from "../../config/Database";
import { Categoria } from "../../models/categoria/Categoria";
import { Produto } from "../../models/produto/Produto";
import { CreateProdutoInput, UpdateProdutoInput } from "../../schema/produto/ProdutoSchema";

class ProdutoRepository {
  private get repository() {
    return database.getRepository(Produto);
  }

  create(data: CreateProdutoInput): Produto {
    const { categoria_id, ...produtoData } = data;

    return this.repository.create({
      ...produtoData,
      preco: String(data.preco),
      categoria: { id: categoria_id } as Categoria,
    });
  }

  save(produto: Produto): Promise<Produto> {
    return this.repository.save(produto);
  }

  findById(id: number): Promise<Produto | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        categoria: true,
      },
    });
  }

  findByNome(nome_produto: string): Promise<Produto | null> {
    return this.repository.findOne({
      where: { nome_produto },
      relations: {
        categoria: true,
      },
    });
  }

  findAll(): Promise<Produto[]> {
    return this.repository.find({
      relations: {
        categoria: true,
      },
      order: {
        nome_produto: "ASC",
      },
    });
  }

  merge(produto: Produto, data: UpdateProdutoInput): Produto {
    const { categoria_id, ...produtoData } = data;

    return Object.assign(produto, {
      ...produtoData,
      nome_produto: data.nome_produto ?? produto.nome_produto,
      descricao_produto: data.descricao_produto ?? produto.descricao_produto,
      preco: data.preco !== undefined ? String(data.preco) : produto.preco,
      estoque_disponivel: data.estoque_disponivel ?? produto.estoque_disponivel,
      categoria: categoria_id ? ({ id: categoria_id } as Categoria) : produto.categoria,
    });
  }

  remove(produto: Produto): Promise<Produto> {
    return this.repository.remove(produto);
  }
}

export { ProdutoRepository };
