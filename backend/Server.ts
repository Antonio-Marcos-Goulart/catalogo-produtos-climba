import "reflect-metadata";

import {startServer} from "./App"
import { error } from "node:console";

startServer().catch((error: unknown ) => {
    console.error("Erro ao iniciar a aplicação: ", error);
    process.exit(1);
});