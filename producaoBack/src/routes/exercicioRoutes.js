import express from "express";
import exerciciosController from "../controllers/exerciciosController.js";
import { autenticarToken as authMiddleware, eAdmin } from "../middlewares/autenticarToken.js";
import { tratarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";

const router = express.Router();

router.use(authMiddleware);
router.use(tratarIdsCriptografados(["idExercicio"]));

// Leitura permitida para qualquer usuário autenticado (atletas e professores)
router.get("/", exerciciosController.listar);
router.get("/:idExercicio", exerciciosController.buscar);

// Gerenciamento do catálogo de exercícios exclusivo para Administradores / Professores
router.post("/", eAdmin, exerciciosController.criar);
router.put("/:idExercicio", eAdmin, exerciciosController.atualizar);
router.delete("/:idExercicio", eAdmin, exerciciosController.deletar);

export default router;
