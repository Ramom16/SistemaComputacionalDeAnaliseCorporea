import treinoExercicioController from "../controllers/treinoExercicioController.js";
import express from "express";
import {autenticarToken as authMiddleware} from "../middlewares/autenticarToken.js";

const router = express.Router();
const treinoRoutes = router

router.post("/:idTreino/exercicios",authMiddleware,treinoExercicioController.adicionar);
router.get("/:idTreino/exercicios",authMiddleware,treinoExercicioController.listar);
router.put("/:idTreino/exercicios/:idExercicio",authMiddleware,treinoExercicioController.atualizar);
router.delete("/:idTreino/exercicios/:idExercicio",authMiddleware,treinoExercicioController.remover);

export default treinoRoutes;