import express from "express";
import usuariosController from "../controllers/usuariosController.js";
import { autenticarToken } from "../middlewares/autenticarToken.js";
import { tratarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";

const router = express.Router();

router.use(autenticarToken);
router.use(tratarIdsCriptografados(["id"]));

// Rota para buscar dados do usuário autenticado ou por ID
router.get("/", usuariosController.selecionarUsuario);

// Rota para desativar a conta do usuário
router.delete("/desativar-conta", usuariosController.desativarConta);

export default router;