import { z } from "zod";

const createMovimentacaoSchema = z.object({
  tipo: z.enum(["entrada", "saida"], {
    message: "O tipo da movimentação deve ser entrada ou saída.",
  }),
  quantidade: z.coerce
    .number()
    .int("A quantidade deve ser um número inteiro.")
    .positive("A quantidade deve ser maior que zero."),
  observacao: z
    .string()
    .trim()
    .max(500, "A observação deve ter no máximo 500 caracteres.")
    .optional(),
  produto_id: z.coerce
    .number()
    .int("O id do produto deve ser um número inteiro.")
    .positive("O id do produto deve ser um número positivo."),
});


const updateMovimentacaoSchema = createMovimentacaoSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar a movimentação.",
  });

export {
  createMovimentacaoSchema,
  updateMovimentacaoSchema,
};
export type CreateMovimentacaoInput = z.infer<typeof createMovimentacaoSchema>;
export type UpdateMovimentacaoInput = z.infer<typeof updateMovimentacaoSchema>;
