import { z } from "zod";

const idParamSchema = z.object({
  id: z.coerce
    .number()
    .int("O id deve ser um número inteiro.")
    .positive("O id deve ser um número positivo."),
});

export { idParamSchema };
