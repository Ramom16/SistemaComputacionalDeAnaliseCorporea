import express from "express";
import usuariosController from "../controllers/usuariosController.js";
import { autenticarToken, eAdmin } from "../middlewares/autenticarToken.js";
import { tratarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";
import uploadImage from "../middlewares/uploadImage.middleware.js";

const router = express.Router();

router.use(autenticarToken);

// ─── Rotas ESTÁTICAS (sem parâmetro :id) — DEVEM vir ANTES das dinâmicas ──────

// Rota para buscar dados do usuário autenticado
router.get("/", usuariosController.selecionarUsuario);

// Rota para atualizar a foto de perfil do usuário autenticado
router.patch("/foto-perfil", uploadImage, usuariosController.atualizarFotoPerfil);

// Rota para o usuário autenticar desativar a própria conta
router.delete("/desativar-conta", usuariosController.desativarConta);

// Rota para salvar/atualizar os tokens de push do usuário autenticado
router.put("/push-token", usuariosController.salvarPushToken);

// Rota para disparar notificação de teste para a conta logada
router.post("/testar-notificacao", usuariosController.testarNotificacao);

// ─── Rotas DINÂMICAS (com parâmetro :id) ─────────────────────────────────────

const tratarId = tratarIdsCriptografados(["id"]);

// Buscar usuário por id
router.get("/:id", tratarId, usuariosController.selecionarUsuario);

// Alterar role (ADMIN only)
router.patch("/:id/role", tratarId, eAdmin, usuariosController.alterarRole);

// Desativar conta de outro usuário (ADMIN only)
router.delete("/:id/desativar", tratarId, eAdmin, usuariosController.desativarUsuarioPorId);

// Reativar conta de usuário desativado (ADMIN only)
router.patch("/:id/reativar", tratarId, eAdmin, usuariosController.reativarUsuarioPorId);

export default router;
