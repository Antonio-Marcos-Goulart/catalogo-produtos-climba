import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import swaggerUi from "swagger-ui-express";

import { initializeDatabase } from "./src/config/database";
import { swaggerSpec } from "./src/config/Swagger";
import { router } from "./src/routes/index"

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", router);

app.get("/", (req, res) => {
  res.json({
    message: "API de Gerenciamento de estoque rodando. Acesse /swagger para documentação ou /api para endpoints.",
  });
});

async function startServer(): Promise<void> {
  await initializeDatabase();

  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}

export { app, startServer };
