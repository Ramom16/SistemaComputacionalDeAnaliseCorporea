import exerciciosController from "../controllers/exerciciosController.js";
import express from "express";
import { autenticarToken as authMiddleware } from "../middlewares/autenticarToken.js";

const router = express.Router();

router.post("/exercicios", authMiddleware, exerciciosController.criar);
router.get("/exercicios", authMiddleware, exerciciosController.listar);
router.get("/exercicios/:idExercicio", authMiddleware, exerciciosController.buscar);
router.put("/exercicios/:idExercicio", authMiddleware, exerciciosController.atualizar);
router.delete("/exercicios/:idExercicio", authMiddleware, exerciciosController.deletar);

export default router;
