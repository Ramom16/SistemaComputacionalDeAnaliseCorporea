import express from "express";
import dadosCorporaisController from "../controllers/dadosCorporaisController.js";
import { autenticarToken } from "../middlewares/autenticarToken.js";

const dadosRoutes = express.Router();

// Aplica autenticação em todas as rotas corporais
dadosRoutes.use(autenticarToken);

dadosRoutes.get('/', dadosCorporaisController.listar);
dadosRoutes.get("/:id" , dadosCorporaisController.buscarPorId);
dadosRoutes.get("/usuario/:id", dadosCorporaisController.buscarPorUsuario);
dadosRoutes.post('/', dadosCorporaisController.criar);
dadosRoutes.put("/:idUsuario", dadosCorporaisController.atualizar);
dadosRoutes.delete("/:idUsuario", dadosCorporaisController.deletar);

export default dadosRoutes;