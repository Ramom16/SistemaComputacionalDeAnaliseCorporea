import { describe, it, expect, vi, beforeEach } from "vitest";
import exerciciosController from "../../src/controllers/exerciciosController.js";

// ─── Mocks ─────────────────────────────────────────────────────────────────

vi.mock("../../src/services/exerciciosService.js", () => ({
  default: {
    criar: vi.fn(),
    listar: vi.fn(),
    buscarPorId: vi.fn(),
    atualizar: vi.fn(),
    deletar: vi.fn()
  }
}));

vi.mock("../../src/middlewares/tratarIdsCriptografados.js", () => ({
  anexarIdsCriptografados: vi.fn((data) => data)
}));

import exerciciosService from "../../src/services/exerciciosService.js";
import crypto from "crypto";

const UUID_EXERCICIO = crypto.randomUUID();

// ─── Helpers ────────────────────────────────────────────────────────────────

function criarResMock() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  };
  return res;
}

function criarReqAdmin(body = {}, params = {}) {
  return { usuario: { id: "admin-id", role: "ADMIN" }, body, params };
}

function criarReqUser(body = {}, params = {}) {
  return { usuario: { id: "user-id", role: "USER" }, body, params };
}

function criarReqSemUsuario(body = {}, params = {}) {
  return { body, params };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── criar ──────────────────────────────────────────────────────────────────

describe("exerciciosController - criar", () => {
  it("deve retornar 403 se o usuário tiver role USER", async () => {
    const req = criarReqUser({ nome: "Supino", grupo_muscular: "Peito" });
    const res = criarResMock();

    await exerciciosController.criar(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Acesso negado. Apenas administradores podem realizar esta operação."
    });
    expect(exerciciosService.criar).not.toHaveBeenCalled();
  });

  it("deve retornar 403 se req.usuario estiver ausente", async () => {
    const req = criarReqSemUsuario({ nome: "Supino" });
    const res = criarResMock();

    await exerciciosController.criar(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(exerciciosService.criar).not.toHaveBeenCalled();
  });

  it("deve retornar 201 se o usuário for ADMIN", async () => {
    const dadosExercicio = { idExercicio: UUID_EXERCICIO, nome: "Supino" };
    exerciciosService.criar.mockResolvedValue(dadosExercicio);

    const req = criarReqAdmin({ nome: "Supino", grupo_muscular: "Peito" });
    const res = criarResMock();

    await exerciciosController.criar(req, res);

    expect(exerciciosService.criar).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Exercício criado com sucesso." })
    );
  });

  it("deve retornar 400 se o serviço lançar erro durante criação por ADMIN", async () => {
    exerciciosService.criar.mockRejectedValue(new Error("Dado inválido"));

    const req = criarReqAdmin({ nome: "X", grupo_muscular: "Peito" });
    const res = criarResMock();

    await exerciciosController.criar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Dado inválido" });
  });
});

// ─── atualizar ──────────────────────────────────────────────────────────────

describe("exerciciosController - atualizar", () => {
  it("deve retornar 403 se o usuário tiver role USER", async () => {
    const req = criarReqUser({ nome: "Leg Press" }, { idExercicio: UUID_EXERCICIO });
    const res = criarResMock();

    await exerciciosController.atualizar(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Acesso negado. Apenas administradores podem realizar esta operação."
    });
    expect(exerciciosService.atualizar).not.toHaveBeenCalled();
  });

  it("deve retornar 403 se req.usuario estiver ausente", async () => {
    const req = criarReqSemUsuario({}, { idExercicio: UUID_EXERCICIO });
    const res = criarResMock();

    await exerciciosController.atualizar(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(exerciciosService.atualizar).not.toHaveBeenCalled();
  });

  it("deve retornar 200 se o usuário for ADMIN", async () => {
    const exercicioAtualizado = { idExercicio: UUID_EXERCICIO, nome: "Leg Press Hack" };
    exerciciosService.atualizar.mockResolvedValue(exercicioAtualizado);

    const req = criarReqAdmin(
      { nome: "Leg Press Hack", grupo_muscular: "Coxa" },
      { idExercicio: UUID_EXERCICIO }
    );
    const res = criarResMock();

    await exerciciosController.atualizar(req, res);

    expect(exerciciosService.atualizar).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Exercício atualizado com sucesso." })
    );
  });
});

// ─── deletar ────────────────────────────────────────────────────────────────

describe("exerciciosController - deletar", () => {
  it("deve retornar 403 se o usuário tiver role USER", async () => {
    const req = criarReqUser({}, { idExercicio: UUID_EXERCICIO });
    const res = criarResMock();

    await exerciciosController.deletar(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Acesso negado. Apenas administradores podem realizar esta operação."
    });
    expect(exerciciosService.deletar).not.toHaveBeenCalled();
  });

  it("deve retornar 403 se req.usuario estiver ausente", async () => {
    const req = criarReqSemUsuario({}, { idExercicio: UUID_EXERCICIO });
    const res = criarResMock();

    await exerciciosController.deletar(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(exerciciosService.deletar).not.toHaveBeenCalled();
  });

  it("deve retornar 200 se o usuário for ADMIN", async () => {
    exerciciosService.deletar.mockResolvedValue(undefined);

    const req = criarReqAdmin({}, { idExercicio: UUID_EXERCICIO });
    const res = criarResMock();

    await exerciciosController.deletar(req, res);

    expect(exerciciosService.deletar).toHaveBeenCalledWith(UUID_EXERCICIO);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Exercício removido com sucesso." });
  });

  it("deve retornar 400 se o serviço lançar erro durante deleção por ADMIN", async () => {
    exerciciosService.deletar.mockRejectedValue(new Error("Exercício não encontrado."));

    const req = criarReqAdmin({}, { idExercicio: UUID_EXERCICIO });
    const res = criarResMock();

    await exerciciosController.deletar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Exercício não encontrado." });
  });
});

// ─── listar / buscar (leitura: qualquer usuário autenticado) ─────────────────

describe("exerciciosController - listar (leitura livre)", () => {
  it("deve retornar 200 para usuário com role USER", async () => {
    exerciciosService.listar.mockResolvedValue([{ idExercicio: UUID_EXERCICIO, nome: "Agachamento" }]);

    const req = criarReqUser();
    const res = criarResMock();

    await exerciciosController.listar(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("deve retornar 200 para usuário com role ADMIN", async () => {
    exerciciosService.listar.mockResolvedValue([]);

    const req = criarReqAdmin();
    const res = criarResMock();

    await exerciciosController.listar(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("exerciciosController - buscar (leitura livre)", () => {
  it("deve retornar 200 para usuário com role USER", async () => {
    exerciciosService.buscarPorId.mockResolvedValue({ idExercicio: UUID_EXERCICIO, nome: "Prancha" });

    const req = criarReqUser({}, { idExercicio: UUID_EXERCICIO });
    const res = criarResMock();

    await exerciciosController.buscar(req, res);

    expect(exerciciosService.buscarPorId).toHaveBeenCalledWith(UUID_EXERCICIO);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("deve retornar 404 se o exercício não for encontrado", async () => {
    exerciciosService.buscarPorId.mockRejectedValue(new Error("Exercício não encontrado."));

    const req = criarReqUser({}, { idExercicio: UUID_EXERCICIO });
    const res = criarResMock();

    await exerciciosController.buscar(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Exercício não encontrado." });
  });
});
