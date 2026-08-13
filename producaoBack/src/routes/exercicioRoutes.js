import exerciciosController from "../controllers/exerciciosController.js";
import express from "express";
import { autenticarToken as authMiddleware } from "../middlewares/autenticarToken.js";

const router = express.Router();

router.post("/", authMiddleware, exerciciosController.criar);
router.get("/", authMiddleware, exerciciosController.listar);
router.get("/:idExercicio", authMiddleware, exerciciosController.buscar);
router.put("/:idExercicio", authMiddleware, exerciciosController.atualizar);
router.delete("/:idExercicio", authMiddleware, exerciciosController.deletar);

export default router;
