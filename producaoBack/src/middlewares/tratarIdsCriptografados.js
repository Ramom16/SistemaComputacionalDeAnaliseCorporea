import { descriptografarId, validarUUID, criptografarId } from "../utils/cryptoUtils.js";

/**
 * Middleware que descriptografa e normaliza automaticamente parâmetros de ID
 * recebidos nos parâmetros de rota, query string ou body.
 * Aceita tanto UUIDs puros quanto IDs cifrados com AES-256-GCM.
 */
export const tratarIdsCriptografados = (camposId = ["id", "idUsuario", "idTreino", "idExercicio", "idDados", "idCalculo", "usuarioId"]) => {
  return (req, res, next) => {
    try {
      // 1. Processar req.params
      if (req.params) {
        for (const campo of camposId) {
          if (req.params[campo]) {
            const decifrado = descriptografarId(req.params[campo]);
            if (!decifrado) {
              return res.status(400).json({
                erro: `Identificador inválido ou corrompido para o campo '${campo}'.`
              });
            }
            req.params[campo] = decifrado;
          }
        }
      }

      // 2. Processar req.query
      if (req.query) {
        for (const campo of camposId) {
          if (req.query[campo]) {
            const decifrado = descriptografarId(req.query[campo]);
            if (!decifrado) {
              return res.status(400).json({
                erro: `Identificador inválido ou corrompido para o parâmetro '${campo}'.`
              });
            }
            req.query[campo] = decifrado;
          }
        }
      }

      // 3. Processar req.body
      if (req.body && typeof req.body === "object") {
        for (const campo of camposId) {
          if (req.body[campo] && typeof req.body[campo] === "string") {
            const decifrado = descriptografarId(req.body[campo]);
            if (!decifrado) {
              return res.status(400).json({
                erro: `Identificador inválido ou corrompido para o campo '${campo}'.`
              });
            }
            req.body[campo] = decifrado;
          }
        }
      }

      next();
    } catch (err) {
      return res.status(400).json({
        erro: "Falha ao processar identificadores de segurança."
      });
    }
  };
};

/**
 * Utilitário para adicionar IDs criptografados nas respostas JSON de forma segura.
 */
export const anexarIdsCriptografados = (objeto) => {
  if (!objeto || typeof objeto !== "object") return objeto;

  if (Array.isArray(objeto)) {
    return objeto.map(item => anexarIdsCriptografados(item));
  }

  const novoObj = { ...objeto };

  const camposParaCriptografar = [
    "id", "idPerfil", "idUsuario", "idDados", "idCalculo",
    "idTreino", "idExercicio", "idHistorico", "usuarioId"
  ];

  for (const campo of camposParaCriptografar) {
    if (novoObj[campo] && typeof novoObj[campo] === "string" && validarUUID(novoObj[campo])) {
      novoObj[`${campo}_criptografado`] = criptografarId(novoObj[campo]);
    }
  }

  return novoObj;
};
