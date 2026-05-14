import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Informe um email valido."),
  senha: z.string().min(1, "A senha e obrigatoria."),
});

export { loginSchema };
export type LoginInput = z.infer<typeof loginSchema>;
