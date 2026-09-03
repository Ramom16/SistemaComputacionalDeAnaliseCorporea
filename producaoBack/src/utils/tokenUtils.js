import crypto from "crypto";

/**
 * Gera um token aleatório seguro de 32 bytes (64 caracteres hexadecimais).
 */
export const gerarTokenAleatorio = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Calcula o hash SHA-256 de um token bruto.
 * Retorna uma string hex de exatamente 64 caracteres para persistência no banco (token_hash).
 */
export const gerarHashSHA256 = (token) => {
  if (!token) return "";
  return crypto.createHash("sha256").update(token).digest("hex");
};