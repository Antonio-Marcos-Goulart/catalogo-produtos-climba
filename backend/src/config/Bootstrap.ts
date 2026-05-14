import bcrypt from "bcryptjs";

import { usuarioRepository } from "../repository/usuario/UsuarioRepository";

async function ensureDefaultUser(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME?.trim();

  if (!adminEmail || !adminPassword || !adminName) {
    throw new Error(
      "As variaveis ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD devem estar definidas no .env.",
    );
  }

  const existingUser = await usuarioRepository.findByEmail(adminEmail);

  if (existingUser) {
    return;
  }

  const senhaHash = await bcrypt.hash(adminPassword, 10);
  const usuario = usuarioRepository.create({
    nome: adminName,
    email: adminEmail,
    senha: senhaHash,
  });

  await usuarioRepository.save(usuario);
  console.log(`Usuario padrao criado: ${adminEmail}`);
}

export { ensureDefaultUser };
