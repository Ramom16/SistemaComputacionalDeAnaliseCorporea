import exerciciosController from "../controllers/exerciciosController.js";
import express from "express";
import { autenticarToken, eAdmin } from "../middlewares/autenticarToken.js";

const router = express.Router();

// Consulta (Libertado para todos os usuários autenticados)
router.get("/", autenticarToken, exerciciosController.listar);
router.get("/:idExercicio", autenticarToken, exerciciosController.buscar);

// Gestão de Exercícios (Apenas Professores / ADMIN)
router.post("/", autenticarToken, eAdmin, exerciciosController.criar);
router.put("/:idExercicio", autenticarToken, eAdmin, exerciciosController.atualizar);
router.delete("/:idExercicio", autenticarToken, eAdmin, exerciciosController.deletar);

export default router;