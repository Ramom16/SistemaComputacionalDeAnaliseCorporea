import cors from "cors";
import helmet from "helmet";

export const securityMiddlewares = (app) => {
  app.use(helmet());

  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://10.87.166.131:5173",
        "https://sistema-computacional-de-analise-co.vercel.app",
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );
};