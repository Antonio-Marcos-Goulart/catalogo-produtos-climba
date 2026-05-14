import { z } from "zod";

const createProdutoSchema = z.object({
  nome_produto: z
    .string()
    .trim()
    .min(1, "O nome do produto é obrigatório.")
    .max(150, "O nome do produto deve ter no máximo 150 caracteres."),
  descricao_produto: z
    .string()
    .trim()
    .min(1, "A descrição do produto é obrigatória.")
    .max(300, "A descrição do produto deve ter no máximo 300 caracteres."),
  preco: z.coerce
    .number()
    .positive("O preço do produto deve ser maior que zero."),
  estoque_disponivel: z.coerce
    .number()
    .int("O estoque disponível deve ser um número inteiro.")
    .min(0, "O estoque disponível não pode ser negativo."),
  categoria_id: z.coerce
    .number()
    .int("O id da categoria deve ser um número inteiro.")
    .positive("O id da categoria deve ser um número positivo."),
});


const updateProdutoSchema = createProdutoSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar o produto.",
  });

export {
  createProdutoSchema,
  updateProdutoSchema,
};
export type CreateProdutoInput = z.infer<typeof createProdutoSchema>;
export type UpdateProdutoInput = z.infer<typeof updateProdutoSchema>;
