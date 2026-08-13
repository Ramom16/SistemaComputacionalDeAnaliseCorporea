import TreinoController from "../controllers/treinoControllers.js";
import express from "express";
import {autenticarToken as authMiddleware} from "../middlewares/autenticarToken.js";

const router = express.Router();
const treinoRoutes = router

router.post("/",authMiddleware,TreinoController.criar);

router.get("/", authMiddleware, TreinoController.listar);

router.get("/:idTreino", authMiddleware, TreinoController.buscar);

router.put("/:idTreino", authMiddleware, TreinoController.atualizar);

router.delete("/:idTreino", authMiddleware, TreinoController.deletar);

export default treinoRoutes;