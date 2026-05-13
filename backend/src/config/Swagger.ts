import swaggerJsdoc from "swagger-jsdoc";

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gerenciamento de Estoque API",
      version: "1.0.0",
    },
    tags: [
      { name: "Categorias" },
      { name: "Produtos" },
      { name: "Movimentacoes de Estoque" },
    ],
    components: {},
  },
  apis: ["./src/routes/**/*.ts"],
});

export { swaggerSpec };
