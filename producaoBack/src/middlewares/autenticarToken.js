import jwt from "jsonwebtoken";

export const autenticarToken = (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ erro: "Token de autenticação não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // decoded agora traz { id, email, role }
    next();
  } catch (error) {
    return res.status(403).json({ erro: "Token inválido ou expirado" });
  }
};

// Middleware para validar se o usuário é Administrador/Professor
export const eAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.role === "ADMIN") {
    return next();
  }
  return res.status(403).json({ erro: "Acesso negado. Apenas professores têm essa permissão." });
};