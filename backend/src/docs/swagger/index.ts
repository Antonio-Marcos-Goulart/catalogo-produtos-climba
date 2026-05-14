import { categoriaSchemas } from "./categoria/categoria.swagger";
import { movimentacaoSchemas } from "./movimentacao/movimentacao.swagger";
import { produtoSchemas } from "./produto/produto.swagger";

const swaggerSchemas = {
  ...categoriaSchemas,
  ...produtoSchemas,
  ...movimentacaoSchemas,
};

export { swaggerSchemas };
