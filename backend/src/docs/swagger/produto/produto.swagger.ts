const produtoBaseProperties = {
  nome_produto: {
    type: "string",
    minLength: 1,
    maxLength: 150,
    example: "Notebook",
  },
  descricao_produto: {
    type: "string",
    minLength: 1,
    maxLength: 300,
    example: "Notebook para trabalho",
  },
  preco: {
    type: "number",
    exclusiveMinimum: 0,
    example: 3500,
  },
  estoque_disponivel: {
    type: "integer",
    minimum: 0,
    example: 10,
  },
  categoria_id: {
    type: "integer",
    minimum: 1,
    example: 1,
  },
};

const produtoSchemas = {
  ProdutoCategoria: {
    type: "object",
    required: ["id", "nome"],
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      nome: {
        type: "string",
        example: "Eletrônicos",
      },
    },
  },
  Produto: {
    type: "object",
    required: ["id", "nome_produto", "descricao_produto", "preco", "estoque_disponivel", "categoria"],
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      nome_produto: produtoBaseProperties.nome_produto,
      descricao_produto: produtoBaseProperties.descricao_produto,
      preco: {
        type: "string",
        example: "3500.00",
      },
      estoque_disponivel: produtoBaseProperties.estoque_disponivel,
      categoria: {
        $ref: "#/components/schemas/ProdutoCategoria",
      },
    },
  },
  CreateProdutoInput: {
    type: "object",
    required: ["nome_produto", "descricao_produto", "preco", "estoque_disponivel", "categoria_id"],
    properties: produtoBaseProperties,
  },
  UpdateProdutoInput: {
    type: "object",
    properties: produtoBaseProperties,
    minProperties: 1,
  },
};

export { produtoBaseProperties, produtoSchemas };
