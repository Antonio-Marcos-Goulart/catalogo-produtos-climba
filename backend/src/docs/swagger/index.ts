import { authSchemas } from "./auth/auth.swagger";
import { categoriaSchemas } from "./categoria/categoria.swagger";
import { movimentacaoSchemas } from "./movimentacao/movimentacao.swagger";
import { produtoSchemas } from "./produto/produto.swagger";

const swaggerSchemas = {
  ...authSchemas,
  ...categoriaSchemas,
  ...produtoSchemas,
  ...movimentacaoSchemas,
};

export { swaggerSchemas };
