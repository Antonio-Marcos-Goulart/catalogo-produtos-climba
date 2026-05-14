import { Router } from "express";

import { categoriaRouter } from "./categoria/CategoriaRoutes";
import { movimentacaoRouter } from "./movimentacao/MovimentacaoRoutes";
import { produtoRouter } from "./produto/ProdutoRoutes";

const router = Router();

router.use("/categorias", categoriaRouter);
router.use("/produtos", produtoRouter);
router.use("/movimentacoes", movimentacaoRouter);

export { router };
