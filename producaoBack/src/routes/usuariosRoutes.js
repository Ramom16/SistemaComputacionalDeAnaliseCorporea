import express from "express";
import usuariosController from "../controllers/usuariosController.js";
import { autenticarToken, eAdmin } from "../middlewares/autenticarToken.js";

const router = express.Router();

// Apenas administradores podem listar/buscar outros usuários
router.get("/", autenticarToken, eAdmin, usuariosController.selecionarUsuario);

export default router;