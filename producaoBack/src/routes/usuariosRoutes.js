import express from "express";
import usuariosController from "../controllers/usuariosController.js";
import { autenticarToken, eAdmin } from "../middlewares/autenticarToken.js";
import { tratarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";

const router = express.Router();

router.use(autenticarToken);
router.use(tratarIdsCriptografados(["id"]));

// Rota para buscar dados do usuário autenticado ou lista/aluno se ADMIN
router.get("/", usuariosController.selecionarUsuario);
router.get("/:id", usuariosController.selecionarUsuario);

// Rota administrativa para alterar role de usuário (USER <-> ADMIN)
router.patch("/:id/role", eAdmin, usuariosController.alterarRole);

export default router;