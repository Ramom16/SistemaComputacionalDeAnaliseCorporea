import express from "express";

import authRoutes from "./authRoutes.js"
import usuariosRoutes from "./usuariosRoutes.js"
import dadosRoutes from "./dadosRoutes.js";
import historyRoutes from "./historyRoutes.js"
import evolucaoRoutes from "./evolucaoRoutes.js";
import treinoRoutes from "./treinoRoutes.js";
import treinoExercicioRoute from "./treinoExercicioRoute.js";
import exercicioRoutes from "./exercicioRoutes.js";
import testeRoutes from "./testeRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/dadosCorporais", dadosRoutes );
router.use("/historico", historyRoutes);
router.use("/evolucao", evolucaoRoutes)
router.use("/treinos", treinoRoutes);
router.use( "/treinoExercicio", treinoExercicioRoute);
router.use("/exercicios",exercicioRoutes);
router.use("/testes", testeRoutes)

export default router