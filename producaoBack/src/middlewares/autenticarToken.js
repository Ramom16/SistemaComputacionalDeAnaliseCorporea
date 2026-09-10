import jwt from "jsonwebtoken";

export const autenticarToken = (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ erro: "Token de autenticação não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = {
      ...decoded,
      role: decoded.role || "USER"
    };
    next();
  } catch (error) {
    return res.status(403).json({ erro: "Token inválido ou expirado" });
  }
};

/**
 * Middleware flexível para autorizar uma ou mais roles (RBAC)
 * Exemplo de uso: router.get('/rota', autenticarToken, autorizarRoles('ADMIN'), controller)
 */
export const autorizarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    const userRole = String(req.usuario.role || "USER").toUpperCase();
    const permitidos = rolesPermitidos.map((r) => String(r).toUpperCase());

    if (!permitidos.includes(userRole)) {
      return res.status(403).json({
        erro: "Acesso negado. Você não possui permissão para acessar este recurso."
      });
    }

    return next();
  };
};

// Middleware para validar se o usuário é Administrador/Professor
export const eAdmin = autorizarRoles("ADMIN");