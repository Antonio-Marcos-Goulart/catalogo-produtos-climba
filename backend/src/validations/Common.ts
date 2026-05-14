import { z } from "zod";

const idParamSchema = z.object({
  id: z.coerce
    .number()
    .int("O id deve ser um número inteiro.")
    .positive("O id deve ser um número positivo."),
});

const nomeParamSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "O nome deve ser informado."),
});

export { idParamSchema, nomeParamSchema };
