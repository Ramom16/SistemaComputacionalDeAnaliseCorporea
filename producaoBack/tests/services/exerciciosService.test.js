import { describe, it, expect, vi, beforeEach } from "vitest";
import exerciciosService from "../../src/services/exerciciosService.js";
import crypto from "crypto";

// Mock completo do repositório de exercícios
vi.mock("../../src/repositories/exerciciosRepositories.js", () => ({
  default: {
    criar: vi.fn(),
    listar: vi.fn(),
    buscarPorId: vi.fn(),
    atualizar: vi.fn(),
    deletar: vi.fn()
  }
}));

// Importa o mock para manipulação nos testes
import exerciciosRepository from "../../src/repositories/exerciciosRepositories.js";

const UUID_EXERCICIO = crypto.randomUUID();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("exerciciosService - criar", () => {
  it("deve criar um exercício válido e retornar os dados do repositório", async () => {
    const dadosRetorno = {
      idExercicio: UUID_EXERCICIO,
      nome: "Supino Reto",
      descricao: "Peitoral médio",
      caminho_video: null
    };
    exerciciosRepository.criar.mockResolvedValue(dadosRetorno);

    const resultado = await exerciciosService.criar({
      nome: "Supino Reto",
      descricao: "Peitoral médio",
      caminho_video: null
    });

    expect(exerciciosRepository.criar).toHaveBeenCalledOnce();
    expect(resultado.nome).toBe("Supino Reto");
    expect(resultado.idExercicio).toBe(UUID_EXERCICIO);
  });

  it("deve propagar erro se o repositório falhar ao criar", async () => {
    exerciciosRepository.criar.mockRejectedValue(new Error("Erro no banco"));
    await expect(exerciciosService.criar({ nome: "Leg Press" })).rejects.toThrow("Erro no banco");
  });

  it("deve lançar erro se o nome for inválido (menos de 2 chars)", async () => {
    await expect(exerciciosService.criar({ nome: "X" })).rejects.toThrow(
      "Nome do exercício deve ter entre 2 e 150 caracteres"
    );
    expect(exerciciosRepository.criar).not.toHaveBeenCalled();
  });
});

describe("exerciciosService - listar", () => {
  it("deve retornar lista de exercícios do repositório", async () => {
    const lista = [
      { idExercicio: UUID_EXERCICIO, nome: "Supino" },
      { idExercicio: crypto.randomUUID(), nome: "Agachamento" }
    ];
    exerciciosRepository.listar.mockResolvedValue(lista);

    const resultado = await exerciciosService.listar();

    expect(exerciciosRepository.listar).toHaveBeenCalledOnce();
    expect(resultado).toHaveLength(2);
  });

  it("deve retornar array vazio quando não houver exercícios", async () => {
    exerciciosRepository.listar.mockResolvedValue([]);
    const resultado = await exerciciosService.listar();
    expect(resultado).toEqual([]);
  });
});

describe("exerciciosService - buscarPorId", () => {
  it("deve retornar o exercício encontrado", async () => {
    const exercicio = { idExercicio: UUID_EXERCICIO, nome: "Rosca Direta" };
    exerciciosRepository.buscarPorId.mockResolvedValue(exercicio);

    const resultado = await exerciciosService.buscarPorId(UUID_EXERCICIO);

    expect(exerciciosRepository.buscarPorId).toHaveBeenCalledWith(UUID_EXERCICIO);
    expect(resultado.nome).toBe("Rosca Direta");
  });

  it("deve lançar erro se o exercício não for encontrado", async () => {
    exerciciosRepository.buscarPorId.mockResolvedValue(null);
    await expect(exerciciosService.buscarPorId(UUID_EXERCICIO)).rejects.toThrow(
      "Exercício não encontrado."
    );
  });
});

describe("exerciciosService - atualizar", () => {
  it("deve atualizar o exercício com dados válidos", async () => {
    const exercicioExistente = { idExercicio: UUID_EXERCICIO, nome: "Supino" };
    const exercicioAtualizado = { idExercicio: UUID_EXERCICIO, nome: "Supino Inclinado" };

    exerciciosRepository.buscarPorId.mockResolvedValue(exercicioExistente);
    exerciciosRepository.atualizar.mockResolvedValue(exercicioAtualizado);

    const resultado = await exerciciosService.atualizar(UUID_EXERCICIO, {
      nome: "Supino Inclinado",
      descricao: null,
      caminho_video: null
    });

    expect(exerciciosRepository.atualizar).toHaveBeenCalledOnce();
    expect(resultado.nome).toBe("Supino Inclinado");
  });

  it("deve lançar erro se o exercício não existir para atualizar", async () => {
    exerciciosRepository.buscarPorId.mockResolvedValue(null);
    await expect(
      exerciciosService.atualizar(UUID_EXERCICIO, { nome: "Flexão", descricao: null, caminho_video: null })
    ).rejects.toThrow("Exercício não encontrado.");
    expect(exerciciosRepository.atualizar).not.toHaveBeenCalled();
  });
});

describe("exerciciosService - deletar", () => {
  it("deve deletar o exercício existente", async () => {
    exerciciosRepository.buscarPorId.mockResolvedValue({ idExercicio: UUID_EXERCICIO });
    exerciciosRepository.deletar.mockResolvedValue({ count: 1 });

    const resultado = await exerciciosService.deletar(UUID_EXERCICIO);

    expect(exerciciosRepository.deletar).toHaveBeenCalledWith(UUID_EXERCICIO);
  });

  it("deve lançar erro se o exercício não existir para deletar", async () => {
    exerciciosRepository.buscarPorId.mockResolvedValue(null);
    await expect(exerciciosService.deletar(UUID_EXERCICIO)).rejects.toThrow(
      "Exercício não encontrado."
    );
    expect(exerciciosRepository.deletar).not.toHaveBeenCalled();
  });
});
