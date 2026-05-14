import swaggerJsdoc from "swagger-jsdoc";

import { swaggerSchemas } from "../docs/swagger";

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gerenciamento de Estoque API",
      version: "1.0.0",
    },
    tags: [
      { name: "Autenticacao" },
      { name: "Categorias" },
      { name: "Produtos" },
      { name: "Movimentacoes de Estoque" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: swaggerSchemas,
    },
  },
  apis: ["./src/routes/**/*.ts"],
});

export { swaggerSchemas, swaggerSpec };
