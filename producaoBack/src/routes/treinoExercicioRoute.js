import treinoExercicioController from "../controllers/treinoExercicioController.js";
import express from "express";
import {autenticarToken as authMiddleware} from "../middlewares/autenticarToken.js";

const router = express.Router();
const treinoRoutes = router

router.post("/treinos/:idTreino/exercicios",authMiddleware,treinoExercicioController.adicionar);
router.get("/treinos/:idTreino/exercicios",authMiddleware,treinoExercicioController.listar);
router.delete("/treinos/:idTreino/exercicios/:idExercicio",authMiddleware,treinoExercicioController.remover);