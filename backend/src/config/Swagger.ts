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
      { name: "Categorias" },
      { name: "Produtos" },
      { name: "Movimentações de Estoque" },
    ],
    components: {
      schemas: swaggerSchemas,
    },
  },
  apis: ["./src/routes/**/*.ts"],
});

export { swaggerSchemas, swaggerSpec };
