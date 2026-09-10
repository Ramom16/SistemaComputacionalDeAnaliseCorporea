import crypto from "crypto";

const ALGORITMO = "aes-256-gcm";
const TAMANHO_IV = 12; // 96 bits recomendados para AES-GCM
const TAMANHO_TAG = 16; // 128 bits para Auth Tag

/**
 * Obtém ou deriva uma chave simétrica de 32 bytes (256 bits) segura
 * a partir de variáveis de ambiente.
 */
function obterChaveMestra() {
  const segredo = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || "default_fallback_secret_key_tcc_2026";
  return crypto.createHash("sha256").update(segredo).digest();
}

/**
 * Valida se uma string é um UUID válido (v1-v5).
 * @param {string} id
 * @returns {boolean}
 */
export function validarUUID(id) {
  if (typeof id !== "string") return false;
  const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regexUUID.test(id.trim());
}

/**
 * Criptografa qualquer texto ou dado usando AES-256-GCM.
 * Formato resultante: base64url(iv + authTag + ciphertext)
 * @param {string} texto
 * @returns {string}
 */
export function criptografar(texto) {
  if (texto === null || texto === undefined) return null;
  const str = String(texto);
  const chave = obterChaveMestra();
  const iv = crypto.randomBytes(TAMANHO_IV);

  const cipher = crypto.createCipheriv(ALGORITMO, chave, iv);
  const cifrado = Buffer.concat([cipher.update(str, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Empacota IV + AuthTag + Cifrado em formato base64url seguro para URLs e JSON
  const payload = Buffer.concat([iv, authTag, cifrado]);
  return payload.toString("base64url");
}

/**
 * Descriptografa um conteúdo gerado por AES-256-GCM.
 * Rejeita qualquer dado adulterado ou inválido.
 * @param {string} payloadBase64Url
 * @returns {string|null}
 */
export function descriptografar(payloadBase64Url) {
  if (!payloadBase64Url || typeof payloadBase64Url !== "string") return null;

  try {
    const payload = Buffer.from(payloadBase64Url, "base64url");
    if (payload.length < TAMANHO_IV + TAMANHO_TAG + 1) {
      return null;
    }

    const iv = payload.subarray(0, TAMANHO_IV);
    const authTag = payload.subarray(TAMANHO_IV, TAMANHO_IV + TAMANHO_TAG);
    const cifrado = payload.subarray(TAMANHO_IV + TAMANHO_TAG);

    const chave = obterChaveMestra();
    const decipher = crypto.createDecipheriv(ALGORITMO, chave, iv);
    decipher.setAuthTag(authTag);

    const decifrado = Buffer.concat([decipher.update(cifrado), decipher.final()]);
    return decifrado.toString("utf8");
  } catch (err) {
    return null;
  }
}

/**
 * Criptografa um identificador (UUID) para tráfego seguro e exibição externa.
 * @param {string} uuid
 * @returns {string}
 */
export function criptografarId(uuid) {
  if (!uuid) return null;
  return criptografar(uuid);
}

/**
 * Descriptografa um identificador criptografado para o UUID original.
 * Se já for um UUID puro válido, retorna ele diretamente.
 * @param {string} idOuCifrado
 * @returns {string|null}
 */
export function descriptografarId(idOuCifrado) {
  if (!idOuCifrado || typeof idOuCifrado !== "string") return null;

  const idLimpo = idOuCifrado.trim();

  // Se já for um UUID válido puro, retorna direto
  if (validarUUID(idLimpo)) {
    return idLimpo;
  }

  // Tenta descriptografar
  const decifrado = descriptografar(idLimpo);
  if (decifrado && validarUUID(decifrado)) {
    return decifrado;
  }

  return null;
}

/**
 * Calcula o hash SHA-256 de uma string para consultas ou tokens seguros.
 * @param {string} dado
 * @returns {string}
 */
export function gerarHashSHA256(dado) {
  if (!dado) return "";
  return crypto.createHash("sha256").update(String(dado)).digest("hex");
}
