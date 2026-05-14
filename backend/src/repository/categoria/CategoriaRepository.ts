import { database } from "../../config/Database";
import { Categoria } from "../../models/categoria/Categoria";
import { CreateCategoriaInput, UpdateCategoriaInput } from "../../schema/categoria/CategoriaSchema"

class CategoriaRepository {
  private get repository() {
    return database.getRepository(Categoria);
  }

  create(data: CreateCategoriaInput): Categoria {
    return this.repository.create(data);
  }

  save(categoria: Categoria): Promise<Categoria> {
    return this.repository.save(categoria);
  }

  findById(id: number): Promise<Categoria | null> {
    return this.repository.findOneBy({ id });
  }

  findByNome(nome: string): Promise<Categoria | null> {
    return this.repository.findOneBy({ nome });
  }
  
  findAll(): Promise<Categoria[]> {
    return this.repository.find({
        order: {
            nome: "ASC",
        },
    });
  }

  merge(categoria: Categoria, data: UpdateCategoriaInput): Categoria {
    return Object.assign(categoria, {
        ...data,
        nome: data.nome ?? categoria.nome,
    });
  }

  remove(categoria: Categoria): Promise<Categoria> {
    return this.repository.remove(categoria);
  }

}

export { CategoriaRepository };
