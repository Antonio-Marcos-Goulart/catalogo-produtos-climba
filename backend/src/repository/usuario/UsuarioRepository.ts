import { database } from "../../config/Database";
import { Usuario } from "../../models/usuario/Usuario";

class UsuarioRepository {
  private get repository() {
    return database.getRepository(Usuario);
  }

  create(data: Pick<Usuario, "nome" | "email" | "senha">): Usuario {
    return this.repository.create(data);
  }

  save(usuario: Usuario): Promise<Usuario> {
    return this.repository.save(usuario);
  }

  findByEmail(email: string): Promise<Usuario | null> {
    return this.repository.findOne({
      where: {
        email,
      },
    });
  }

  findById(id: number): Promise<Usuario | null> {
    return this.repository.findOne({
      where: {
        id,
      },
    });
  }
}

const usuarioRepository = new UsuarioRepository();

export { usuarioRepository };
