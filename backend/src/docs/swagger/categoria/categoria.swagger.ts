const categoriaBaseProperties = {
  nome: {
    type: "string",
    minLength: 1,
    maxLength: 100,
    example: "Eletrônicos",
  },
};

const categoriaSchemas = {
  Categoria: {
    type: "object",
    required: ["id", "nome"],
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      ...categoriaBaseProperties,
    },
  },
  CreateCategoriaInput: {
    type: "object",
    required: ["nome"],
    properties: categoriaBaseProperties,
  },
  UpdateCategoriaInput: {
    type: "object",
    properties: categoriaBaseProperties,
    minProperties: 1,
  },
};

export { categoriaBaseProperties, categoriaSchemas };
