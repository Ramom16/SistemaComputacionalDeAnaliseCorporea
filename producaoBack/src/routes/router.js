import express from "express";

import authRoutes from "./authRoutes.js"
import usuariosRoutes from "./usuariosRoutes.js"
import dadosRoutes from "./dadosRoutes.js";



const router = express.Router();


app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/dadosCorporais", dadosRoutes );

export default router