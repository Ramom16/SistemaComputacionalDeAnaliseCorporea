import express from "express";
import dadosCorporaisController from "../controllers/dadosCorporaisController.js";
import { autenticarToken } from "../middlewares/autenticarToken.js";
import { tratarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";

const dadosRoutes = express.Router();

// Aplica autenticação e tratamento de IDs em todas as rotas de dados corporais
dadosRoutes.use(autenticarToken);
dadosRoutes.use(tratarIdsCriptografados(["id", "idUsuario"]));

dadosRoutes.get("/", dadosCorporaisController.listar);
dadosRoutes.get("/:id", dadosCorporaisController.buscarPorId);
dadosRoutes.get("/usuario/:id", dadosCorporaisController.buscarPorUsuario);

dadosRoutes.post("/", dadosCorporaisController.criar);

dadosRoutes.put("/:idUsuario", dadosCorporaisController.atualizar);
dadosRoutes.put("/", dadosCorporaisController.atualizar);

dadosRoutes.delete("/:idUsuario", dadosCorporaisController.deletar);
dadosRoutes.delete("/", dadosCorporaisController.deletar);

export default dadosRoutes;
