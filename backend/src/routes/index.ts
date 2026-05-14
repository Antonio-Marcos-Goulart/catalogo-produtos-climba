import { Router } from "express";

import { authMiddleware } from "../middlewares/AuthMiddleware";
import { authRouter } from "./auth/AuthRoutes";
import { categoriaRouter } from "./categoria/CategoriaRoutes";
import { movimentacaoRouter } from "./movimentacao/MovimentacaoRoutes";
import { produtoRouter } from "./produto/ProdutoRoutes";

const router = Router();

router.use("/auth", authRouter);
router.use(authMiddleware);
router.use("/categorias", categoriaRouter);
router.use("/produtos", produtoRouter);
router.use("/movimentacoes", movimentacaoRouter);

export { router };
