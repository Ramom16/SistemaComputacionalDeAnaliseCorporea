import dadosCorporaisController from "../controllers/dadosCorporaisController.js"
import express from "express";


const dadosRoutes = express.Router();

dadosRoutes.get('/', dadosCorporaisController.listar);
dadosRoutes.get("/:id" , dadosCorporaisController.buscarPorId);
dadosRoutes.get("/usuario/:id", dadosCorporaisController.buscarPorUsuario);

dadosRoutes.post('/', dadosCorporaisController.criar);

dadosRoutes.put("/:idUsuario", dadosCorporaisController.atualizar);

dadosRoutes.delete("/", dadosCorporaisController.deletar);

export default dadosRoutes