import express from "express";
import TreinoController from "../controllers/treinoControllers.js";
import { autenticarToken as authMiddleware } from "../middlewares/autenticarToken.js";
import { tratarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";

const router = express.Router();

router.use(authMiddleware);
router.use(tratarIdsCriptografados(["idTreino", "idCalculo"]));

router.post("/", TreinoController.criar);
router.get("/", TreinoController.listar);
router.get("/:idTreino", TreinoController.buscar);
router.put("/:idTreino", TreinoController.atualizar);
router.delete("/:idTreino", TreinoController.deletar);

export default router;