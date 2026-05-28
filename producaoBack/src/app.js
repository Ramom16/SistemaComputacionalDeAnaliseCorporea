import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { autenticarToken } from "./middlewares/autenticarToken.js";
import router from "./routes/router.js";


dotenv.config();

const app = express();

// MIDDLEWARES GLOBAIS
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.FRONT_URL,
  ],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// ROTAS PÚBLICAS
app.use('/', router)

// ROTA PROTEGIDA DE TESTE
app.get("/perfil", autenticarToken, (req, res) => {
  return res.status(200).json({
    msg: "Rota protegida",
    usuario: req.usuario
  });
});

// ROTA TESTE
app.get("/", (req, res) => {
  return res.status(200).json({
    msg: "API rodando com sucesso"
  });
});

// TRATAMENTO DE ERROS (fallback)
app.use((err, req, res, next) => {
  console.error("Erro interno:", err);

  return res.status(500).json({
    erro: "Erro interno no servidor"
  });
});

export default app;
