import express from "express";
import exerciciosController from "../controllers/exerciciosController.js";
import { autenticarToken as authMiddleware } from "../middlewares/autenticarToken.js";
import { tratarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";

const router = express.Router();

router.use(authMiddleware);
router.use(tratarIdsCriptografados(["idExercicio"]));

router.post("/", exerciciosController.criar);
router.get("/", exerciciosController.listar);
router.get("/:idExercicio", exerciciosController.buscar);
router.put("/:idExercicio", exerciciosController.atualizar);
router.delete("/:idExercicio", exerciciosController.deletar);

// Gestão de Exercícios (Apenas Professores / ADMIN)
router.post("/", autenticarToken, eAdmin, exerciciosController.criar);
router.put("/:idExercicio", autenticarToken, eAdmin, exerciciosController.atualizar);
router.delete("/:idExercicio", autenticarToken, eAdmin, exerciciosController.deletar);

export default router;