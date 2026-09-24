import { describe, it, expect, vi, beforeEach } from "vitest";
import treinoExercicioService from "../../src/services/treinoExercicioService.js";
import crypto from "crypto";

vi.mock("../../src/database/prismaClient.js", () => ({
  default: {
    treino: { findFirst: vi.fn() },
    exercicio: { findUnique: vi.fn() }
  }
}));

vi.mock("../../src/repositories/treinoExercicioRepository.js", () => ({
  default: {
    adicionar: vi.fn(),
    buscar: vi.fn(),
    listarPorTreino: vi.fn(),
    remover: vi.fn(),
    atualizar: vi.fn()
  }
}));

import prisma from "../../src/database/prismaClient.js";
import treinoExercicioRepository from "../../src/repositories/treinoExercicioRepository.js";

const UUID_USUARIO = crypto.randomUUID();
const UUID_OUTRO = crypto.randomUUID();
const UUID_TREINO = crypto.randomUUID();
const UUID_EXERCICIO = crypto.randomUUID();

const TREINO_VALIDO = { idTreino: UUID_TREINO };
const EXERCICIO_VALIDO = { idExercicio: UUID_EXERCICIO, nome: "Agachamento" };
const DADOS_VINCULO = {
  idExercicio: UUID_EXERCICIO,
  series: 3,
  repeticoes: 12,
  descanso_segundos: 60,
  grupo_muscular: "Quadríceps",
  tipo: "Força"
};

beforeEach(() => vi.clearAllMocks());

describe("treinoExercicioService - adicionar", () => {
  it("deve adicionar exercício ao treino do usuário com sucesso", async () => {
    prisma.treino.findFirst.mockResolvedValue(TREINO_VALIDO);
    prisma.exercicio.findUnique.mockResolvedValue(EXERCICIO_VALIDO);
    treinoExercicioRepository.buscar.mockResolvedValue(null); // não existe ainda
    treinoExercicioRepository.adicionar.mockResolvedValue({ idTreino: UUID_TREINO, idExercicio: UUID_EXERCICIO });

    const resultado = await treinoExercicioService.adicionar(UUID_USUARIO, UUID_TREINO, DADOS_VINCULO);

    expect(prisma.treino.findFirst).toHaveBeenCalledWith({
      where: {
        idTreino: UUID_TREINO,
        calculo: { dados: { idUsuario: UUID_USUARIO } }
      }
    });
    expect(treinoExercicioRepository.adicionar).toHaveBeenCalledOnce();
  });

  it("deve bloquear adição se o treino não pertencer ao usuário (IDOR)", async () => {
    prisma.treino.findFirst.mockResolvedValue(null); // treino não pertence ao usuário

    await expect(
      treinoExercicioService.adicionar(UUID_USUARIO, UUID_TREINO, DADOS_VINCULO)
    ).rejects.toThrow("Treino não encontrado ou não pertence ao usuário.");

    expect(treinoExercicioRepository.adicionar).not.toHaveBeenCalled();
  });

  it("deve bloquear adição se o exercício não existir", async () => {
    prisma.treino.findFirst.mockResolvedValue(TREINO_VALIDO);
    prisma.exercicio.findUnique.mockResolvedValue(null);

    await expect(
      treinoExercicioService.adicionar(UUID_USUARIO, UUID_TREINO, DADOS_VINCULO)
    ).rejects.toThrow("Exercício não encontrado.");

    expect(treinoExercicioRepository.adicionar).not.toHaveBeenCalled();
  });

  it("deve bloquear adição de exercício duplicado no mesmo treino", async () => {
    prisma.treino.findFirst.mockResolvedValue(TREINO_VALIDO);
    prisma.exercicio.findUnique.mockResolvedValue(EXERCICIO_VALIDO);
    treinoExercicioRepository.buscar.mockResolvedValue({ idTreino: UUID_TREINO, idExercicio: UUID_EXERCICIO }); // já existe

    await expect(
      treinoExercicioService.adicionar(UUID_USUARIO, UUID_TREINO, DADOS_VINCULO)
    ).rejects.toThrow("Este exercício já está associado ao treino.");

    expect(treinoExercicioRepository.adicionar).not.toHaveBeenCalled();
  });
});

describe("treinoExercicioService - listar", () => {
  it("deve listar exercícios do treino pertencente ao usuário", async () => {
    prisma.treino.findFirst.mockResolvedValue(TREINO_VALIDO);
    treinoExercicioRepository.listarPorTreino.mockResolvedValue([
      { idTreino: UUID_TREINO, idExercicio: UUID_EXERCICIO }
    ]);

    const resultado = await treinoExercicioService.listar(UUID_USUARIO, UUID_TREINO);

    expect(treinoExercicioRepository.listarPorTreino).toHaveBeenCalledWith(UUID_TREINO);
    expect(resultado).toHaveLength(1);
  });

  it("deve bloquear listagem de treino de outro usuário", async () => {
    prisma.treino.findFirst.mockResolvedValue(null);

    await expect(
      treinoExercicioService.listar(UUID_OUTRO, UUID_TREINO)
    ).rejects.toThrow("Treino não encontrado ou não pertence ao usuário.");
  });
});

describe("treinoExercicioService - remover", () => {
  it("deve remover exercício do treino do usuário", async () => {
    prisma.treino.findFirst.mockResolvedValue(TREINO_VALIDO);
    treinoExercicioRepository.remover.mockResolvedValue({ count: 1 });

    await treinoExercicioService.remover(UUID_USUARIO, UUID_TREINO, UUID_EXERCICIO);

    expect(treinoExercicioRepository.remover).toHaveBeenCalledWith(UUID_TREINO, UUID_EXERCICIO);
  });

  it("deve bloquear remoção de exercício de treino de outro usuário", async () => {
    prisma.treino.findFirst.mockResolvedValue(null);

    await expect(
      treinoExercicioService.remover(UUID_OUTRO, UUID_TREINO, UUID_EXERCICIO)
    ).rejects.toThrow("Treino não encontrado ou não pertence ao usuário.");

    expect(treinoExercicioRepository.remover).not.toHaveBeenCalled();
  });
});

describe("treinoExercicioService - atualizar", () => {
  it("deve atualizar o vínculo se o treino pertencer ao usuário e o exercício existir no treino", async () => {
    prisma.treino.findFirst.mockResolvedValue(TREINO_VALIDO);
    treinoExercicioRepository.buscar.mockResolvedValue({ idTreino: UUID_TREINO, idExercicio: UUID_EXERCICIO });
    treinoExercicioRepository.atualizar.mockResolvedValue({ series: 4 });

    const resultado = await treinoExercicioService.atualizar(
      UUID_USUARIO, UUID_TREINO, UUID_EXERCICIO, { series: 4 }
    );

    expect(treinoExercicioRepository.atualizar).toHaveBeenCalledWith(UUID_TREINO, UUID_EXERCICIO, { series: 4 });
  });

  it("deve bloquear atualização se o exercício não estiver no treino", async () => {
    prisma.treino.findFirst.mockResolvedValue(TREINO_VALIDO);
    treinoExercicioRepository.buscar.mockResolvedValue(null); // não está no treino

    await expect(
      treinoExercicioService.atualizar(UUID_USUARIO, UUID_TREINO, UUID_EXERCICIO, { series: 4 })
    ).rejects.toThrow("Exercício não encontrado neste treino.");

    expect(treinoExercicioRepository.atualizar).not.toHaveBeenCalled();
  });

  it("deve bloquear atualização se o treino não pertencer ao usuário", async () => {
    prisma.treino.findFirst.mockResolvedValue(null);

    await expect(
      treinoExercicioService.atualizar(UUID_OUTRO, UUID_TREINO, UUID_EXERCICIO, { series: 4 })
    ).rejects.toThrow("Treino não encontrado ou não pertence ao usuário.");
  });
});
