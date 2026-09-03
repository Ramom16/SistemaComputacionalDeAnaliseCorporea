import express from "express";
import treinoExercicioController from "../controllers/treinoExercicioController.js";
import { autenticarToken as authMiddleware } from "../middlewares/autenticarToken.js";
import { tratarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";

const router = express.Router();

router.use(authMiddleware);
router.use(tratarIdsCriptografados(["idTreino", "idExercicio"]));

router.post("/:idTreino/exercicios", treinoExercicioController.adicionar);
router.get("/:idTreino/exercicios", treinoExercicioController.listar);
router.put("/:idTreino/exercicios/:idExercicio", treinoExercicioController.atualizar);
router.delete("/:idTreino/exercicios/:idExercicio", treinoExercicioController.remover);

export default router;