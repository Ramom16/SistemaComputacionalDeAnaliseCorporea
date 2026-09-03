import { describe, it, expect, vi, beforeEach } from "vitest";
import { anexarIdsCriptografados, tratarIdsCriptografados } from "../../src/middlewares/tratarIdsCriptografados.js";
import { criptografarId } from "../../src/utils/cryptoUtils.js";
import crypto from "crypto";

const UUID_A = crypto.randomUUID();
const UUID_B = crypto.randomUUID();

describe("anexarIdsCriptografados - objeto simples", () => {
  it("deve anexar id_criptografado para o campo id", () => {
    const obj = { id: UUID_A, nome: "João" };
    const resultado = anexarIdsCriptografados(obj);
    expect(resultado.id_criptografado).toBeDefined();
    expect(resultado.id).toBe(UUID_A); // preserva o original
    expect(resultado.nome).toBe("João"); // preserva outros campos
  });

  it("deve anexar idUsuario_criptografado para o campo idUsuario", () => {
    const obj = { idUsuario: UUID_A };
    const resultado = anexarIdsCriptografados(obj);
    expect(resultado.idUsuario_criptografado).toBeDefined();
  });

  it("deve anexar múltiplos IDs criptografados ao mesmo tempo", () => {
    const obj = { id: UUID_A, idUsuario: UUID_B };
    const resultado = anexarIdsCriptografados(obj);
    expect(resultado.id_criptografado).toBeDefined();
    expect(resultado.idUsuario_criptografado).toBeDefined();
  });

  it("não deve adicionar campo criptografado para campos sem UUID válido", () => {
    const obj = { id: "nao-e-uuid", nome: "Maria" };
    const resultado = anexarIdsCriptografados(obj);
    expect(resultado.id_criptografado).toBeUndefined();
  });

  it("deve retornar null/primitivos sem alteração", () => {
    expect(anexarIdsCriptografados(null)).toBeNull();
    expect(anexarIdsCriptografados("string")).toBe("string");
    expect(anexarIdsCriptografados(42)).toBe(42);
  });
});

describe("anexarIdsCriptografados - arrays", () => {
  it("deve processar cada item do array", () => {
    const lista = [
      { id: UUID_A, nome: "A" },
      { id: UUID_B, nome: "B" }
    ];
    const resultado = anexarIdsCriptografados(lista);
    expect(resultado).toHaveLength(2);
    expect(resultado[0].id_criptografado).toBeDefined();
    expect(resultado[1].id_criptografado).toBeDefined();
  });

  it("deve retornar array vazio como array vazio", () => {
    const resultado = anexarIdsCriptografados([]);
    expect(resultado).toEqual([]);
  });
});

// Helpers para simular request/response/next do Express
function criarReqResMock({ params = {}, query = {}, body = {} } = {}) {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  };
  const req = { params, query, body };
  const next = vi.fn();
  return { req, res, next };
}

describe("tratarIdsCriptografados - middleware (req.params)", () => {
  it("deve passar UUID puro diretamente para next()", () => {
    const { req, res, next } = criarReqResMock({
      params: { idExercicio: UUID_A }
    });
    const middleware = tratarIdsCriptografados(["idExercicio"]);
    middleware(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.params.idExercicio).toBe(UUID_A);
  });

  it("deve descriptografar ID cifrado em req.params", () => {
    const idCifrado = criptografarId(UUID_A);
    const { req, res, next } = criarReqResMock({
      params: { idExercicio: idCifrado }
    });
    const middleware = tratarIdsCriptografados(["idExercicio"]);
    middleware(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.params.idExercicio).toBe(UUID_A);
  });

  it("deve retornar 400 para ID totalmente inválido em req.params", () => {
    const { req, res, next } = criarReqResMock({
      params: { id: "id_totalmente_invalido_e_adulterado" }
    });
    const middleware = tratarIdsCriptografados(["id"]);
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("tratarIdsCriptografados - middleware (req.query)", () => {
  it("deve descriptografar ID cifrado em req.query", () => {
    const idCifrado = criptografarId(UUID_B);
    const { req, res, next } = criarReqResMock({
      query: { idUsuario: idCifrado }
    });
    const middleware = tratarIdsCriptografados(["idUsuario"]);
    middleware(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.query.idUsuario).toBe(UUID_B);
  });

  it("deve retornar 400 para query ID inválido", () => {
    const { req, res, next } = criarReqResMock({
      query: { idUsuario: "string_invalida_sem_uuid" }
    });
    const middleware = tratarIdsCriptografados(["idUsuario"]);
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("tratarIdsCriptografados - middleware (req.body)", () => {
  it("deve descriptografar ID cifrado em req.body", () => {
    const idCifrado = criptografarId(UUID_A);
    const { req, res, next } = criarReqResMock({
      body: { idCalculo: idCifrado }
    });
    const middleware = tratarIdsCriptografados(["idCalculo"]);
    middleware(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.body.idCalculo).toBe(UUID_A);
  });

  it("deve ignorar campos do body que não estão na lista de campos monitorados", () => {
    const { req, res, next } = criarReqResMock({
      body: { idCalculo: UUID_A, objetivo: "hipertrofia" }
    });
    const middleware = tratarIdsCriptografados(["id"]); // não monitoramos idCalculo aqui
    middleware(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.body.idCalculo).toBe(UUID_A); // não foi alterado
  });

  it("deve chamar next() normalmente se nenhum campo monitorado estiver no body", () => {
    const { req, res, next } = criarReqResMock({
      body: { objetivo: "emagrecimento" }
    });
    const middleware = tratarIdsCriptografados(["id"]);
    middleware(req, res, next);
    expect(next).toHaveBeenCalledOnce();
  });
});
