import dadosCorporaisController from "../controllers/dadosCorporaisController.js"
import express from "express";


const dadosRoutes = express.Router();

dadosRoutes.get('/', dadosCorporaisController.listar);
dadosRoutes.get("/:idDados" , dadosCorporaisController.buscarPorId);
dadosRoutes.get("/:idUsuario", dadosCorporaisController.buscarPorUsuario);

dadosRoutes.post('/', dadosCorporaisController.criar);

dadosRoutes.put("/", dadosCorporaisController.atualizar);

dadosRoutes.delete("/", dadosCorporaisController.deletar);

export default dadosRoutes