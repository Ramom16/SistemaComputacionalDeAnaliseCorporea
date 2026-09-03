import express from "express";
import EvolucaoController from "../controllers/evolucaoController.js";
import { autenticarToken } from "../middlewares/autenticarToken.js";
import { tratarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";

const evolucaoRoutes = express.Router();

evolucaoRoutes.use(autenticarToken);
evolucaoRoutes.use(tratarIdsCriptografados(["id", "idUsuario"]));

evolucaoRoutes.get("/", EvolucaoController.buscar);
evolucaoRoutes.get("/:id", EvolucaoController.buscar);

export default evolucaoRoutes;