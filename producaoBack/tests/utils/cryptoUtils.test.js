import { describe, it, expect } from "vitest";
import {
  criptografar,
  descriptografar,
  criptografarId,
  descriptografarId,
  validarUUID,
  gerarHashSHA256
} from "../../src/utils/cryptoUtils.js";
import crypto from "crypto";

describe("cryptoUtils - validarUUID", () => {
  it("deve aceitar UUID v4 válido", () => {
    const uuid = crypto.randomUUID();
    expect(validarUUID(uuid)).toBe(true);
  });

  it("deve aceitar UUID v1 válido", () => {
    expect(validarUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).toBe(true);
  });

  it("deve aceitar UUID v4 com letras maiúsculas", () => {
    expect(validarUUID("550E8400-E29B-41D4-A716-446655440000")).toBe(true);
  });

  it("deve rejeitar número inteiro simples", () => {
    expect(validarUUID("12345")).toBe(false);
  });

  it("deve rejeitar string vazia", () => {
    expect(validarUUID("")).toBe(false);
  });

  it("deve rejeitar null", () => {
    expect(validarUUID(null)).toBe(false);
  });

  it("deve rejeitar undefined", () => {
    expect(validarUUID(undefined)).toBe(false);
  });

  it("deve rejeitar SQL injection", () => {
    expect(validarUUID("1' OR '1'='1")).toBe(false);
  });

  it("deve rejeitar número como tipo", () => {
    expect(validarUUID(123)).toBe(false);
  });

  it("deve rejeitar UUID com formato inválido (menos hifens)", () => {
    expect(validarUUID("550e8400e29b41d4a716446655440000")).toBe(false);
  });
});

describe("cryptoUtils - criptografar / descriptografar", () => {
  it("deve criptografar e descriptografar corretamente", () => {
    const original = "segredo_corporeo_2026";
    const cifrado = criptografar(original);
    expect(descriptografar(cifrado)).toBe(original);
  });

  it("o texto cifrado deve ser diferente do original", () => {
    const original = "dado_sensivel";
    const cifrado = criptografar(original);
    expect(cifrado).not.toBe(original);
  });

  it("cada cifração deve gerar output diferente (IV aleatório)", () => {
    const texto = "mesmo_texto";
    const cifrado1 = criptografar(texto);
    const cifrado2 = criptografar(texto);
    expect(cifrado1).not.toBe(cifrado2);
  });

  it("deve retornar null para dados adulterados (falha de auth tag)", () => {
    expect(descriptografar("dado_completamente_invalido_e_adulterado")).toBeNull();
  });

  it("deve retornar null para input nulo", () => {
    expect(descriptografar(null)).toBeNull();
  });

  it("deve retornar null para string vazia", () => {
    expect(descriptografar("")).toBeNull();
  });

  it("criptografar null deve retornar null", () => {
    expect(criptografar(null)).toBeNull();
  });

  it("criptografar undefined deve retornar null", () => {
    expect(criptografar(undefined)).toBeNull();
  });

  it("deve criptografar strings com caracteres especiais e UTF-8", () => {
    const original = "Análise Corpórea: 75,5 kg — João da Sílva 🏋️";
    const cifrado = criptografar(original);
    expect(descriptografar(cifrado)).toBe(original);
  });
});

describe("cryptoUtils - criptografarId / descriptografarId", () => {
  it("deve criptografar e descriptografar um UUID corretamente", () => {
    const uuid = crypto.randomUUID();
    const cifrado = criptografarId(uuid);
    const restaurado = descriptografarId(cifrado);
    expect(restaurado).toBe(uuid);
  });

  it("o ID cifrado não deve expor o UUID original", () => {
    const uuid = crypto.randomUUID();
    const cifrado = criptografarId(uuid);
    expect(cifrado).not.toBe(uuid);
    expect(cifrado).not.toContain(uuid);
  });

  it("descriptografarId deve aceitar UUID puro como passthrough", () => {
    const uuid = crypto.randomUUID();
    expect(descriptografarId(uuid)).toBe(uuid);
  });

  it("criptografarId com valor falsy deve retornar null", () => {
    expect(criptografarId(null)).toBeNull();
    expect(criptografarId("")).toBeNull();
    expect(criptografarId(undefined)).toBeNull();
  });

  it("descriptografarId com string aleatória inválida deve retornar null", () => {
    expect(descriptografarId("id_invalido_sem_criptografia")).toBeNull();
  });

  it("descriptografarId deve rejeitar ID com número inteiro", () => {
    expect(descriptografarId("42")).toBeNull();
  });

  it("descriptografarId com null deve retornar null", () => {
    expect(descriptografarId(null)).toBeNull();
  });
});

describe("cryptoUtils - gerarHashSHA256", () => {
  it("deve gerar um hash SHA-256 de 64 caracteres hex", () => {
    const hash = gerarHashSHA256("token_de_email_verificacao");
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("o mesmo input deve gerar sempre o mesmo hash (determinístico)", () => {
    const hash1 = gerarHashSHA256("mesmo_input");
    const hash2 = gerarHashSHA256("mesmo_input");
    expect(hash1).toBe(hash2);
  });

  it("inputs diferentes devem gerar hashes diferentes", () => {
    expect(gerarHashSHA256("inputA")).not.toBe(gerarHashSHA256("inputB"));
  });

  it("deve retornar string vazia para valor falsy", () => {
    expect(gerarHashSHA256("")).toBe("");
    expect(gerarHashSHA256(null)).toBe("");
  });
});
