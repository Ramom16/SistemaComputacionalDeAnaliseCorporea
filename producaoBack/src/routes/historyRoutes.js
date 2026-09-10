import express from "express";
import EvolucaoController from "../controllers/evolucaoController.js";
import { autenticarToken } from "../middlewares/autenticarToken.js";
import { tratarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";

const historyRoutes = express.Router();

historyRoutes.use(autenticarToken);
historyRoutes.use(tratarIdsCriptografados(["id", "idUsuario"]));

historyRoutes.get("/usuario/:id", EvolucaoController.buscar);
historyRoutes.get("/", EvolucaoController.buscar);

export default historyRoutes;