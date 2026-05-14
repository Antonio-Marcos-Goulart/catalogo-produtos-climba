import jwt, { type SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";

 import { usuarioRepository } from "../../repository/usuario/UsuarioRepository";
import type { LoginInput, RegisterInput } from "../../schema/auth/AuthSchema";

class AuthInvalidCredentialsError extends Error {}
class AuthUserNotFoundError extends Error {}
class AuthEmailAlreadyInUseError extends Error {}

type AuthTokenPayload = {
  userId: number,
  email: string,
  nome: string,
};

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "8h") as SignOptions["expiresIn"];

class AuthService {
  async register(data: RegisterInput) {
    const email = data.email.trim().toLowerCase();
    const existingUser = await usuarioRepository.findByEmail(email);

    if (existingUser) {
      throw new AuthEmailAlreadyInUseError("Ja existe um usuario cadastrado com este email.");
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);
    const usuario = usuarioRepository.create({
      nome: data.nome.trim(),
      email,
      senha: senhaHash,
    });

    const savedUser = await usuarioRepository.save(usuario);

    return {
      id: savedUser.id,
      nome: savedUser.nome,
      email: savedUser.email,
    };
  }

  async login(data: LoginInput) {
    const usuario = await usuarioRepository.findByEmail(data.email.trim().toLowerCase());

    if (!usuario) {
      throw new AuthInvalidCredentialsError("Email ou senha invalidos.");
    }

    const senhaValida = await bcrypt.compare(data.senha, usuario.senha);

    if (!senhaValida) {
      throw new AuthInvalidCredentialsError("Email ou senha invalidos.");
    }

    const token = jwt.sign(
      {
        userId: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      },
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    };
  }

  async getUserById(id: number) {
    const usuario = await usuarioRepository.findById(id);

    if (!usuario) {
      throw new AuthUserNotFoundError("Usuario nao encontrado.");
    }

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    };
  }

  verifyToken(token: string): AuthTokenPayload {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  }
}

const authService = new AuthService();

export {
  AuthEmailAlreadyInUseError,
  AuthInvalidCredentialsError,
  AuthUserNotFoundError,
  authService,
};
export type { AuthTokenPayload };
