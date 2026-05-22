import express from "express";
import usuariosController from "../controllers/usuariosController.js";

const router = express.Router();

// Rota para buscar usuários - GET /usuarios ou /usuarios?id=xxx
router.get("/", usuariosController.selecionarUsuario);

export default router;