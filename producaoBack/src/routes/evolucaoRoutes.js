import express from "express";
import EvolucaoController from "../controllers/evolucaoController.js";

const evolucaoRoutes = express.Router();

evolucaoRoutes.get("/:id", EvolucaoController.buscar);





export default evolucaoRoutes;