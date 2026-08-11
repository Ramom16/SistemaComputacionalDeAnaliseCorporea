import TreinoController from "../controllers/treinoControllers.js";
import express from "express";
import {autenticarToken as authMiddleware} from "../middlewares/autenticarToken.js";

const router = express.Router();
const treinoRoutes = router

router.post("/treinos",authMiddleware,treinoController.criar);

router.get("/treinos", authMiddleware, treinoController.listar);

router.get("/treinos/:idTreino", authMiddleware, treinoController.buscar);

export default treinoRoutes;