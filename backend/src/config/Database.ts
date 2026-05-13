import dotenv from "dotenv";
import path from "node:path";
import "reflect-metadata";
import { DataSource } from "typeorm";

import { Categoria } from "../models/categoria/Categoria";
import { MovimentacaoEstoque } from "../models/movimentacao/MovimentacaoEstoque";
import { Produto } from "../models/produto/Produto";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const database = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "",
  username: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  ssl: process.env.DB_SSL === "true",

  entities: [Categoria, Produto, MovimentacaoEstoque],

  synchronize:
    process.env.DB_SYNCHRONIZE === "true" || process.env.NODE_ENV !== "production",
});

async function initializeDatabase(): Promise<void> {
  if (database.isInitialized) {
    return;
  }
  await database.initialize();
}

export { database, initializeDatabase };
