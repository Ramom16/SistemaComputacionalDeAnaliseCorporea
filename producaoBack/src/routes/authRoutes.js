import express from "express";
import authController from "../controllers/authController.js";
import { autenticarToken } from "../middlewares/autenticarToken.js";

const router = express.Router();

// Rotas Públicas
router.post("/register", authController.criar);
router.post("/login", authController.login);
router.get("/verificar-email", authController.verificarEmail);
router.post("/reenviar-email", authController.reenviarEmail);
router.post("/solicitar-recuperacao", authController.solicitarRecuperacaoSenha);
router.post("/redefinir-senha", authController.redefinirSenha);

// Rotas Protegidas (Exigem Token JWT)
router.get("/me", autenticarToken, authController.me);
router.post("/alterar-senha", autenticarToken, authController.alterarSenha);

export default router;
