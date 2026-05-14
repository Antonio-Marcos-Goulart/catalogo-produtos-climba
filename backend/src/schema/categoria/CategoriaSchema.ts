import { z } from "zod";

const createCategoriaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "O nome da categoria é obrigatório.")
    .max(100, "O nome da categoria deve ter no máximo 100 caracteres."),
});

const updateCategoriaSchema = createCategoriaSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Informe ao menos um campo para atualizar a categoria.",
  },
);

export { createCategoriaSchema, updateCategoriaSchema, };
export type CreateCategoriaInput = z.infer<typeof createCategoriaSchema>;
export type UpdateCategoriaInput = z.infer<typeof updateCategoriaSchema>;
