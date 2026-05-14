import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import swaggerUi from "swagger-ui-express";

import { initializeDatabase } from "./src/config/Database";
import { swaggerSpec } from "./src/config/Swagger";
import { errorHandler } from "./src/middlewares/ErrorHandler";
import { router } from "./src/routes/index";

dotenv.config({
  path: path.resolve(__dirname, "./.env"),
});

const app = express();
const port = Number(process.env.PORT || 3000);

function resolveFrontendPath() {
  const possiblePaths = [
    path.resolve(__dirname, "../frontend"),
    path.resolve(__dirname, "../../frontend"),
  ];

  const existingPath = possiblePaths.find((currentPath) =>
    fs.existsSync(path.join(currentPath, "index.html")),
  );

  return existingPath || possiblePaths[0];
}

const frontendPath = resolveFrontendPath();

app.use(cors());
app.use(express.json());
app.use(express.static(frontendPath));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", router);
app.use(errorHandler);

app.get("/", (_req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});

app.get("/login", (_req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});

app.get("/app", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

async function startServer(): Promise<void> {
  await initializeDatabase();

  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}

export { app, startServer };
