import { describe, it, expect } from "vitest";
import { Exercicio } from "../../src/models/Exercicios.js";
import crypto from "crypto";

const UUID_VALIDO = crypto.randomUUID();

describe("Modelo Exercicio - criar", () => {
  it("deve criar exercício com nome e descrição", () => {
    const e = Exercicio.criar({ nome: "Supino Reto", descricao: "Peitoral", caminho_video: null });
    expect(e.nome).toBe("Supino Reto");
    expect(e.descricao).toBe("Peitoral");
    expect(e.caminho_video).toBeNull();
    expect(e.idExercicio).toBeNull();
  });

  it("deve criar exercício somente com nome (descrição opcional)", () => {
    const e = Exercicio.criar({ nome: "Agachamento" });
    expect(e.nome).toBe("Agachamento");
    expect(e.descricao).toBeNull();
  });

  it("deve criar exercício com caminho de vídeo", () => {
    const e = Exercicio.criar({
      nome: "Remada Baixa",
      descricao: "Costas",
      caminho_video: "/videos/remada.mp4"
    });
    expect(e.caminho_video).toBe("/videos/remada.mp4");
  });
});

describe("Modelo Exercicio - setter idExercicio", () => {
  it("deve aceitar UUID válido", () => {
    const e = new Exercicio("Rosca Direta", null, null, UUID_VALIDO);
    expect(e.idExercicio).toBe(UUID_VALIDO);
  });

  it("deve aceitar null como idExercicio", () => {
    const e = new Exercicio("Leg Press", null, null, null);
    expect(e.idExercicio).toBeNull();
  });

  it("deve rejeitar ID inteiro (string numérica)", () => {
    expect(() => new Exercicio("Puxada", null, null, "15")).toThrow(
      "ID do exercício deve ser um UUID válido"
    );
  });

  it("deve rejeitar string aleatória sem formato UUID", () => {
    expect(() => new Exercicio("Tríceps", null, null, "nao-e-uuid")).toThrow();
  });
});

describe("Modelo Exercicio - setter nome", () => {
  it("deve rejeitar nome com menos de 2 caracteres", () => {
    expect(() => Exercicio.criar({ nome: "A" })).toThrow(
      "Nome do exercício deve ter entre 2 e 150 caracteres"
    );
  });

  it("deve rejeitar nome com mais de 150 caracteres", () => {
    expect(() => Exercicio.criar({ nome: "X".repeat(151) })).toThrow(
      "Nome do exercício deve ter entre 2 e 150 caracteres"
    );
  });

  it("deve aceitar nome no limite inferior (2 chars)", () => {
    const e = Exercicio.criar({ nome: "AB" });
    expect(e.nome).toBe("AB");
  });

  it("deve normalizar nome removendo espaços em branco", () => {
    const e = Exercicio.criar({ nome: "  Flexão   " });
    expect(e.nome).toBe("Flexão");
  });

  it("deve rejeitar nome não-string", () => {
    expect(() => Exercicio.criar({ nome: 123 })).toThrow();
  });
});

describe("Modelo Exercicio - setter descricao", () => {
  it("deve aceitar null", () => {
    const e = Exercicio.criar({ nome: "Prancha", descricao: null });
    expect(e.descricao).toBeNull();
  });

  it("deve rejeitar descrição com mais de 255 caracteres", () => {
    expect(() => Exercicio.criar({ nome: "Prancha", descricao: "X".repeat(256) })).toThrow(
      "Descrição do exercício inválida"
    );
  });
});

describe("Modelo Exercicio - setter caminho_video", () => {
  it("deve aceitar null", () => {
    const e = Exercicio.criar({ nome: "Burpee" });
    expect(e.caminho_video).toBeNull();
  });

  it("deve rejeitar caminho de vídeo com mais de 255 caracteres", () => {
    expect(() => Exercicio.criar({
      nome: "Burpee",
      caminho_video: "/videos/" + "a".repeat(248) + ".mp4"
    })).toThrow("Caminho do vídeo inválido");
  });
});

describe("Modelo Exercicio - método editar", () => {
  it("deve criar instância com idExercicio via editar", () => {
    const e = Exercicio.editar({
      idExercicio: UUID_VALIDO,
      nome: "Supino Inclinado",
      descricao: "Peitoral superior",
      caminho_video: null
    });
    expect(e.idExercicio).toBe(UUID_VALIDO);
    expect(e.nome).toBe("Supino Inclinado");
  });

  it("deve lançar erro se idExercicio estiver ausente no editar", () => {
    expect(() => Exercicio.editar({
      idExercicio: null,
      nome: "Supino",
      descricao: null,
      caminho_video: null
    })).toThrow("ID do exercício é obrigatório");
  });
});
