import TreinoController from "../controllers/treinoControllers.js";
import express from "express";
import {autenticarToken as authMiddleware} from "../middlewares/autenticarToken.js";

const router = express.Router();
const treinoRoutes = router

router.post("/treinos",authMiddleware,TreinoController.criar);

router.get("/treinos", authMiddleware, TreinoController.listar);

router.get("/treinos/:idTreino", authMiddleware, TreinoController.buscar);

export default treinoRoutes;