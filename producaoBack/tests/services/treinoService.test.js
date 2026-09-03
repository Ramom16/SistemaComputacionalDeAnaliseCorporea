import { describe, it, expect, vi, beforeEach } from "vitest";
import treinoService from "../../src/services/treinoService.js";
import crypto from "crypto";

// Mock do repositório de treinos
vi.mock("../../src/repositories/treinoRepository.js", () => ({
  default: {
    criar: vi.fn(),
    listarPorUsuario: vi.fn(),
    buscarPorId: vi.fn(),
    atualizar: vi.fn(),
    deletar: vi.fn()
  }
}));

// Mock do prismaClient para a verificação de posse do cálculo (proteção IDOR)
vi.mock("../../src/database/prismaClient.js", () => ({
  default: {
    calculo: {
      findFirst: vi.fn()
    },
    treino: {
      findFirst: vi.fn()
    }
  }
}));

import treinoRepository from "../../src/repositories/treinoRepository.js";
import prisma from "../../src/database/prismaClient.js";

const UUID_USUARIO = crypto.randomUUID();
const UUID_OUTRO_USUARIO = crypto.randomUUID();
const UUID_TREINO = crypto.randomUUID();
const UUID_CALCULO = crypto.randomUUID();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("treinoService - criar", () => {
  it("deve criar treino se o cálculo pertencer ao usuário", async () => {
    prisma.calculo.findFirst.mockResolvedValue({ idCalculo: UUID_CALCULO });
    treinoRepository.criar.mockResolvedValue({
      idTreino: UUID_TREINO,
      idCalculo: UUID_CALCULO,
      objetivo: "hipertrofia",
      nivel: "Intermediario"
    });

    const resultado = await treinoService.criar(UUID_USUARIO, {
      idCalculo: UUID_CALCULO,
      objetivo: "hipertrofia",
      nivel: "Intermediario"
    });

    expect(prisma.calculo.findFirst).toHaveBeenCalledWith({
      where: {
        idCalculo: UUID_CALCULO,
        dados: { idUsuario: UUID_USUARIO }
      }
    });
    expect(treinoRepository.criar).toHaveBeenCalledOnce();
    expect(resultado.objetivo).toBe("hipertrofia");
  });

  it("deve lançar erro IDOR se o cálculo não pertencer ao usuário", async () => {
    prisma.calculo.findFirst.mockResolvedValue(null); // cálculo não encontrado para este usuário

    await expect(treinoService.criar(UUID_USUARIO, {
      idCalculo: UUID_CALCULO,
      objetivo: "emagrecimento",
      nivel: "Iniciante"
    })).rejects.toThrow("O cálculo informado não foi encontrado ou não pertence ao usuário.");

    expect(treinoRepository.criar).not.toHaveBeenCalled();
  });

  it("deve lançar erro se campos obrigatórios estiverem faltando", async () => {
    await expect(treinoService.criar(UUID_USUARIO, {
      objetivo: "hipertrofia"
      // idCalculo e nivel ausentes
    })).rejects.toThrow("idCalculo, objetivo e nivel são obrigatórios.");

    expect(prisma.calculo.findFirst).not.toHaveBeenCalled();
  });

  it("deve lançar erro se objetivo estiver faltando", async () => {
    await expect(treinoService.criar(UUID_USUARIO, {
      idCalculo: UUID_CALCULO,
      nivel: "Iniciante"
    })).rejects.toThrow("idCalculo, objetivo e nivel são obrigatórios.");
  });
});

describe("treinoService - listarPorUsuario", () => {
  it("deve retornar a lista de treinos do usuário", async () => {
    const lista = [
      { idTreino: UUID_TREINO, objetivo: "hipertrofia" }
    ];
    treinoRepository.listarPorUsuario.mockResolvedValue(lista);

    const resultado = await treinoService.listarPorUsuario(UUID_USUARIO);

    expect(treinoRepository.listarPorUsuario).toHaveBeenCalledWith(UUID_USUARIO);
    expect(resultado).toHaveLength(1);
  });

  it("deve retornar lista vazia se o usuário não tiver treinos", async () => {
    treinoRepository.listarPorUsuario.mockResolvedValue([]);
    const resultado = await treinoService.listarPorUsuario(UUID_USUARIO);
    expect(resultado).toEqual([]);
  });
});

describe("treinoService - buscarPorId", () => {
  it("deve retornar o treino se pertencer ao usuário", async () => {
    const treino = {
      idTreino: UUID_TREINO,
      objetivo: "resistencia",
      calculo: {
        dados: {
          usuario: { id: UUID_USUARIO }
        }
      }
    };
    treinoRepository.buscarPorId.mockResolvedValue(treino);

    const resultado = await treinoService.buscarPorId(UUID_USUARIO, UUID_TREINO);

    expect(treinoRepository.buscarPorId).toHaveBeenCalledWith(UUID_TREINO);
    expect(resultado.objetivo).toBe("resistencia");
  });

  it("deve lançar erro IDOR se o treino não pertencer ao usuário", async () => {
    const treinoDe_OutroUsuario = {
      idTreino: UUID_TREINO,
      calculo: {
        dados: {
          usuario: { id: UUID_OUTRO_USUARIO } // dono diferente
        }
      }
    };
    treinoRepository.buscarPorId.mockResolvedValue(treinoDe_OutroUsuario);

    await expect(treinoService.buscarPorId(UUID_USUARIO, UUID_TREINO)).rejects.toThrow(
      "Você não possui permissão para acessar este treino."
    );
  });

  it("deve lançar erro se o treino não existir", async () => {
    treinoRepository.buscarPorId.mockResolvedValue(null);
    await expect(treinoService.buscarPorId(UUID_USUARIO, UUID_TREINO)).rejects.toThrow(
      "Treino não encontrado."
    );
  });
});

describe("treinoService - atualizar", () => {
  it("deve atualizar o treino se o usuário for o dono", async () => {
    const treino = {
      idTreino: UUID_TREINO,
      calculo: { dados: { usuario: { id: UUID_USUARIO } } }
    };
    const treinoAtualizado = { idTreino: UUID_TREINO, nivel: "Avancado" };
    treinoRepository.buscarPorId.mockResolvedValue(treino);
    treinoRepository.atualizar.mockResolvedValue(treinoAtualizado);

    const resultado = await treinoService.atualizar(UUID_USUARIO, UUID_TREINO, { nivel: "Avancado" });

    expect(treinoRepository.atualizar).toHaveBeenCalledWith(UUID_TREINO, { nivel: "Avancado" });
    expect(resultado.nivel).toBe("Avancado");
  });

  it("deve bloquear atualização de treino de outro usuário", async () => {
    const treinoDeOutro = {
      idTreino: UUID_TREINO,
      calculo: { dados: { usuario: { id: UUID_OUTRO_USUARIO } } }
    };
    treinoRepository.buscarPorId.mockResolvedValue(treinoDeOutro);

    await expect(treinoService.atualizar(UUID_USUARIO, UUID_TREINO, { nivel: "Avancado" })).rejects.toThrow(
      "Você não possui permissão para acessar este treino."
    );
    expect(treinoRepository.atualizar).not.toHaveBeenCalled();
  });
});

describe("treinoService - deletar", () => {
  it("deve deletar o treino se o usuário for o dono", async () => {
    const treino = {
      idTreino: UUID_TREINO,
      calculo: { dados: { usuario: { id: UUID_USUARIO } } }
    };
    treinoRepository.buscarPorId.mockResolvedValue(treino);
    treinoRepository.deletar.mockResolvedValue({ count: 1 });

    await treinoService.deletar(UUID_USUARIO, UUID_TREINO);

    expect(treinoRepository.deletar).toHaveBeenCalledWith(UUID_TREINO);
  });

  it("deve bloquear deleção de treino de outro usuário", async () => {
    const treinoDeOutro = {
      idTreino: UUID_TREINO,
      calculo: { dados: { usuario: { id: UUID_OUTRO_USUARIO } } }
    };
    treinoRepository.buscarPorId.mockResolvedValue(treinoDeOutro);

    await expect(treinoService.deletar(UUID_USUARIO, UUID_TREINO)).rejects.toThrow(
      "Você não possui permissão para acessar este treino."
    );
    expect(treinoRepository.deletar).not.toHaveBeenCalled();
  });
});
