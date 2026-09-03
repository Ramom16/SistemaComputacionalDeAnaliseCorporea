import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { autenticarToken } from "./middlewares/autenticarToken.js";
import router from "./routes/router.js";

dotenv.config();

const app = express();

// 1. CABEÇALHOS DE SEGURANÇA (HELMET)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. LIMITADOR DE REQUISIÇÕES (RATE LIMITING)
const limitadorGeral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // limite de 300 requisições por janela
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: "Muitas requisições originadas deste IP. Tente novamente mais tarde." }
});

const limitadorAuth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 30, // limite de 30 tentativas em auth
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: "Limite de tentativas excedido para autenticação. Tente novamente em 15 minutos." }
});

app.use(limitadorGeral);
app.use("/auth", limitadorAuth);

// 3. CORS
const origensPermitidas = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origensPermitidas.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origem não permitida pela política CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));

// 4. PARSER COM LIMITES DE TAMANHO SEGUROS
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// 5. ROTAS
app.use("/", router);

// ROTA PROTEGIDA DE TESTE
app.get("/perfil", autenticarToken, (req, res) => {
  return res.status(200).json({
    msg: "Rota protegida",
    usuario: req.usuario
  });
});

// ROTA TESTE DE SAÚDE
app.get("/", (req, res) => {
  return res.status(200).json({
    msg: "API rodando com sucesso e blindada com segurança máxima"
  });
});

// TRATAMENTO DE ERROS (FALLBACK SEGURO)
app.use((err, req, res, next) => {
  console.error("Erro interno capturado:", err);

  const status = err.status || 500;
  return res.status(status).json({
    erro: status === 500 ? "Erro interno no servidor" : err.message
  });
});

export default app;
