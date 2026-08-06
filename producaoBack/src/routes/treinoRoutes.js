import TreinoController from "../controllers/treinoControllers.js";
import express from "express";

const router = express.Router();
const treinoRoutes = router

treinoRoutes.get("/", TreinoController.listar);
treinoRoutes.post("/", TreinoController.criar);
treinoRoutes.put("/", TreinoController.editar);

export default treinoRoutes;