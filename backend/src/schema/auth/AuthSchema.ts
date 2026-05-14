import { z } from "zod";

const registerSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "O nome e obrigatorio.")
    .max(120, "O nome deve ter no maximo 120 caracteres."),
  email: z.string().trim().email("Informe um email valido."),
  senha: z
    .string()
    .min(8, "A senha deve ter no minimo 8 caracteres.")
    .max(100, "A senha deve ter no maximo 100 caracteres."),
});

const loginSchema = z.object({
  email: z.string().trim().email("Informe um email valido."),
  senha: z.string().min(1, "A senha e obrigatoria."),
});

export { registerSchema, loginSchema };
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
