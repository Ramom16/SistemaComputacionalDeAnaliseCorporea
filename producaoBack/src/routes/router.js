import express from "express";

import authRoutes from "./authRoutes.js"
import usuariosRoutes from "./usuariosRoutes.js"
import dadosRoutes from "./dadosRoutes.js";
import treinoRoutes from "./treinoRoutes.js";
import treinoExercicioRoute from "./treinoExercicioRoute.js";
import exercicioRoutes from "./exercicioRoutes.js";


const router = express.Router();


router.use("/auth", authRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/dadosCorporais", dadosRoutes );
router.use("/treinos", treinoRoutes);
router.use(treinoExercicioRoute);
router.use(exercicioRoutes);

export default router