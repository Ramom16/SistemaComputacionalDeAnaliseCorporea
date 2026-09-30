import { describe, it, expect } from "vitest";
import { Exercicio } from "../../src/models/Exercicios.js";
import crypto from "crypto";

const UUID_VALIDO = crypto.randomUUID();

describe("Modelo Exercicio - criar", () => {
  it("deve criar exercício com nome, grupo muscular e descrição", () => {
    const e = Exercicio.criar({ nome: "Supino Reto", grupo_muscular: "Peito", descricao: "Peitoral", caminho_video: null });
    expect(e.nome).toBe("Supino Reto");
    expect(e.grupo_muscular).toBe("Peito");
    expect(e.descricao).toBe("Peitoral");
    expect(e.caminho_video).toBeNull();
    expect(e.idExercicio).toBeNull();
  });

  it("deve criar exercício somente com nome e grupo muscular (descrição opcional)", () => {
    const e = Exercicio.criar({ nome: "Agachamento", grupo_muscular: "Coxa" });
    expect(e.nome).toBe("Agachamento");
    expect(e.grupo_muscular).toBe("Coxa");
    expect(e.descricao).toBeNull();
  });

  it("deve criar exercício com caminho de vídeo", () => {
    const e = Exercicio.criar({
      nome: "Remada Baixa",
      grupo_muscular: "Costa",
      descricao: "Costas",
      caminho_video: "/videos/remada.mp4"
    });
    expect(e.grupo_muscular).toBe("Costa");
    expect(e.caminho_video).toBe("/videos/remada.mp4");
  });
});

describe("Modelo Exercicio - setter idExercicio", () => {
  it("deve aceitar UUID válido", () => {
    const e = new Exercicio("Rosca Direta", "Braço", null, null, UUID_VALIDO);
    expect(e.idExercicio).toBe(UUID_VALIDO);
  });

  it("deve aceitar null como idExercicio", () => {
    const e = new Exercicio("Leg Press", "Coxa", null, null, null);
    expect(e.idExercicio).toBeNull();
  });

  it("deve rejeitar ID inteiro (string numérica)", () => {
    expect(() => new Exercicio("Puxada", "Costa", null, null, "15")).toThrow(
      "ID do exercício deve ser um UUID válido"
    );
  });

  it("deve rejeitar string aleatória sem formato UUID", () => {
    expect(() => new Exercicio("Tríceps", "Braço", null, null, "nao-e-uuid")).toThrow();
  });
});

describe("Modelo Exercicio - setter nome", () => {
  it("deve rejeitar nome com menos de 2 caracteres", () => {
    expect(() => Exercicio.criar({ nome: "A", grupo_muscular: "Peito" })).toThrow(
      "Nome do exercício deve ter entre 2 e 150 caracteres"
    );
  });

  it("deve rejeitar nome com mais de 150 caracteres", () => {
    expect(() => Exercicio.criar({ nome: "X".repeat(151), grupo_muscular: "Peito" })).toThrow(
      "Nome do exercício deve ter entre 2 e 150 caracteres"
    );
  });

  it("deve aceitar nome no limite inferior (2 chars)", () => {
    const e = Exercicio.criar({ nome: "AB", grupo_muscular: "Peito" });
    expect(e.nome).toBe("AB");
  });

  it("deve normalizar nome removendo espaços em branco", () => {
    const e = Exercicio.criar({ nome: "  Flexão   ", grupo_muscular: "Peito" });
    expect(e.nome).toBe("Flexão");
  });

  it("deve rejeitar nome não-string", () => {
    expect(() => Exercicio.criar({ nome: 123, grupo_muscular: "Peito" })).toThrow();
  });
});

describe("Modelo Exercicio - setter grupo_muscular", () => {
  it("deve aceitar todos os grupos musculares válidos", () => {
    const gruposValidos = ["Peito", "Costa", "Ombro", "Braço", "Antebraço", "Coxa", "Perna", "Glúteos", "Abdomen", "Cardio"];
    for (const grupo of gruposValidos) {
      const e = Exercicio.criar({ nome: "Exercício Teste", grupo_muscular: grupo });
      expect(e.grupo_muscular).toBe(grupo);
    }
  });

  it("deve rejeitar grupo muscular inválido", () => {
    expect(() => Exercicio.criar({ nome: "Exercício Teste", grupo_muscular: "Biceps" })).toThrow(
      "Grupo muscular inválido"
    );
  });

  it("deve rejeitar grupo muscular vazio ou ausente", () => {
    expect(() => Exercicio.criar({ nome: "Exercício Teste" })).toThrow(
      "Grupo muscular inválido"
    );
  });
});

describe("Modelo Exercicio - setter descricao", () => {
  it("deve aceitar null", () => {
    const e = Exercicio.criar({ nome: "Prancha", grupo_muscular: "Abdomen", descricao: null });
    expect(e.descricao).toBeNull();
  });

  it("deve rejeitar descrição com mais de 255 caracteres", () => {
    expect(() => Exercicio.criar({ nome: "Prancha", grupo_muscular: "Abdomen", descricao: "X".repeat(256) })).toThrow(
      "Descrição do exercício inválida"
    );
  });
});

describe("Modelo Exercicio - setter caminho_video", () => {
  it("deve aceitar null", () => {
    const e = Exercicio.criar({ nome: "Burpee", grupo_muscular: "Cardio" });
    expect(e.caminho_video).toBeNull();
  });

  it("deve rejeitar caminho de vídeo com mais de 255 caracteres", () => {
    expect(() => Exercicio.criar({
      nome: "Burpee",
      grupo_muscular: "Cardio",
      caminho_video: "/videos/" + "a".repeat(248) + ".mp4"
    })).toThrow("Caminho do vídeo inválido");
  });
});

describe("Modelo Exercicio - método editar", () => {
  it("deve criar instância com idExercicio via editar", () => {
    const e = Exercicio.editar({
      idExercicio: UUID_VALIDO,
      nome: "Supino Inclinado",
      grupo_muscular: "Peito",
      descricao: "Peitoral superior",
      caminho_video: null
    });
    expect(e.idExercicio).toBe(UUID_VALIDO);
    expect(e.nome).toBe("Supino Inclinado");
    expect(e.grupo_muscular).toBe("Peito");
  });

  it("deve lançar erro se idExercicio estiver ausente no editar", () => {
    expect(() => Exercicio.editar({
      idExercicio: null,
      nome: "Supino",
      grupo_muscular: "Peito",
      descricao: null,
      caminho_video: null
    })).toThrow("ID do exercício é obrigatório");
  });
});
