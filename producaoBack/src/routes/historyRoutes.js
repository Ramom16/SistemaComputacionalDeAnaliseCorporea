import express from "express";
import EvolucaoController from "../controllers/evolucaoController.js";
const historyRoutes = express.Router();


historyRoutes.get("/usuario/:idUsuario",EvolucaoController.buscar);


export default historyRoutes