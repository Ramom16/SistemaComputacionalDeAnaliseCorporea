import { describe, it, expect, vi, beforeEach } from "vitest";
import { autenticarToken } from "../../src/middlewares/autenticarToken.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "segredo_teste_jwt_2026";

// Mock do process.env
vi.stubEnv("JWT_SECRET", JWT_SECRET);

function criarTokenValido(payload = {}) {
  return jwt.sign(
    { id: "test-id", email: "test@email.com", nome: "Teste", ...payload },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

function criarResMock() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  };
  return res;
}

describe("Middleware autenticarToken", () => {
  let next;

  beforeEach(() => {
    next = vi.fn();
  });

  it("deve chamar next() com token válido no header Authorization", () => {
    const token = criarTokenValido();
    const req = {
      headers: { authorization: `Bearer ${token}` }
    };
    const res = criarResMock();
    autenticarToken(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.usuario).toBeDefined();
    expect(req.usuario.email).toBe("test@email.com");
  });

  it("deve retornar 401 se não houver header Authorization", () => {
    const req = { headers: {} };
    const res = criarResMock();
    autenticarToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 se o header não tiver Bearer", () => {
    const req = { headers: { authorization: "" } };
    const res = criarResMock();
    autenticarToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 403 se o token for inválido/adulterado", () => {
    const req = {
      headers: { authorization: "Bearer token.totalmente.invalido" }
    };
    const res = criarResMock();
    autenticarToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 403 se o token estiver expirado", () => {
    const token = jwt.sign(
      { id: "id-expirado", email: "expirado@email.com" },
      JWT_SECRET,
      { expiresIn: "-1s" } // já expirado
    );
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = criarResMock();
    autenticarToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("deve retornar 403 se o token for assinado com segredo diferente", () => {
    const tokenComOutroSegredo = jwt.sign(
      { id: "id-falso", email: "falso@email.com" },
      "outro_segredo_totalmente_diferente",
      { expiresIn: "1h" }
    );
    const req = { headers: { authorization: `Bearer ${tokenComOutroSegredo}` } };
    const res = criarResMock();
    autenticarToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("deve popular req.usuario com dados do payload JWT", () => {
    const token = criarTokenValido({ id: "uuid-teste", nome: "Carlos Teste" });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = criarResMock();
    autenticarToken(req, res, next);
    expect(req.usuario.id).toBe("uuid-teste");
    expect(req.usuario.nome).toBe("Carlos Teste");
  });
});
