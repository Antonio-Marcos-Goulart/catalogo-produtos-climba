const movimentacaoBaseProperties = {
  tipo: {
    type: "string",
    enum: ["entrada", "saida"],
    example: "entrada",
  },
  quantidade: {
    type: "integer",
    minimum: 1,
    example: 5,
  },
  observacao: {
    type: "string",
    maxLength: 500,
    nullable: true,
    example: "Entrada por reposição",
  },
  produto_id: {
    type: "integer",
    minimum: 1,
    example: 1,
  },
};

const movimentacaoSchemas = {
  MovimentacaoProduto: {
    type: "object",
    required: ["id", "nome_produto", "descricao_produto", "preco", "estoque_disponivel"],
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      nome_produto: {
        type: "string",
        example: "Notebook",
      },
      descricao_produto: {
        type: "string",
        example: "Notebook para trabalho",
      },
      preco: {
        type: "string",
        example: "3500.00",
      },
      estoque_disponivel: {
        type: "integer",
        example: 10,
      },
    },
  },
  Movimentacao: {
    type: "object",
    required: ["id", "tipo", "quantidade", "revertida", "dataMovimentacao", "produto"],
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      tipo: movimentacaoBaseProperties.tipo,
      quantidade: movimentacaoBaseProperties.quantidade,
      observacao: movimentacaoBaseProperties.observacao,
      revertida: {
        type: "boolean",
        example: false,
      },
      dataMovimentacao: {
        type: "string",
        format: "date-time",
        example: "2026-05-10T21:30:00.000Z",
      },
      produto: {
        $ref: "#/components/schemas/MovimentacaoProduto",
      },
    },
  },
  CreateMovimentacaoInput: {
    type: "object",
    required: ["tipo", "quantidade", "produto_id"],
    properties: movimentacaoBaseProperties,
  },
};

export { movimentacaoBaseProperties, movimentacaoSchemas };
