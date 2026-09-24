import express from "express";
import usuariosController from "../controllers/usuariosController.js";
import { autenticarToken, eAdmin } from "../middlewares/autenticarToken.js";
import { tratarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";

const router = express.Router();

router.use(autenticarToken);

// ─── Rotas ESTÁTICAS (sem parâmetro :id) — DEVEM vir ANTES das dinâmicas ──────

// Rota para buscar dados do usuário autenticado
router.get("/", usuariosController.selecionarUsuario);

// Rota para o usuário autenticar desativar a própria conta
router.delete("/desativar-conta", usuariosController.desativarConta);

// Rota para salvar/atualizar os tokens de push do usuário autenticado
router.put("/push-token", usuariosController.salvarPushToken);

// Rota para disparar notificação de teste para a conta logada
router.post("/testar-notificacao", usuariosController.testarNotificacao);

// ─── Rotas DINÂMICAS (com parâmetro :id) ─────────────────────────────────────

router.use(tratarIdsCriptografados(["id"]));

// Buscar usuário por id
router.get("/:id", usuariosController.selecionarUsuario);

// Alterar role (ADMIN only)
router.patch("/:id/role", eAdmin, usuariosController.alterarRole);

// Desativar conta de outro usuário (ADMIN only)
router.delete("/:id/desativar", eAdmin, usuariosController.desativarUsuarioPorId);

// Reativar conta de usuário desativado (ADMIN only)
router.patch("/:id/reativar", eAdmin, usuariosController.reativarUsuarioPorId);

export default router;
