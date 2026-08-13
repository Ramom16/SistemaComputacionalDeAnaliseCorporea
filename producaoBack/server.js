import dotenv from "dotenv";
import app from "./src/app.js";
dotenv.config();


const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0" ,  () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});