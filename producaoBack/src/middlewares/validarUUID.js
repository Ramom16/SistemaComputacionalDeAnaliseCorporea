import { validarUUID } from "../utils/cryptoUtils.js";

/**
 * Valida se um determinado parâmetro de rota é um UUID válido.
 * @param {string} paramName Nome do parâmetro na URL (ex: 'id', 'idTreino')
 */
export const validarParametroUUID = (paramName = "id") => {
  return (req, res, next) => {
    const valor = req.params[paramName];
    if (!valor || !validarUUID(valor)) {
      return res.status(400).json({
        erro: `O parâmetro '${paramName}' deve ser um UUID válido no formato v4.`
      });
    }
    next();
  };
};
