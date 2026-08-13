import express from "express";

import authRoutes from "./authRoutes.js"
import usuariosRoutes from "./usuariosRoutes.js"
import dadosRoutes from "./dadosRoutes.js";



const router = express.Router();


router.use("/auth", authRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/dadosCorporais", dadosRoutes );

export default router