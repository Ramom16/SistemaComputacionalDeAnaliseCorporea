import { autenticarToken } from "../middlewares/autenticarToken.js";
import { eAdmin } from "../middlewares/autenticarToken.js";
import express from "express";

const testeRoutes = express.Router();


testeRoutes.get("/auth", autenticarToken, (req, res) => {
  res.json({
    mensagem: "Token válido",
    usuario: req.usuario
  });
});

testeRoutes.get(
  "/admin",
  autenticarToken,
  eAdmin,
  (req, res) => {
    res.json({
      mensagem: "Você é ADMIN",
      usuario: req.usuario
    });
  }
);

export default testeRoutes;