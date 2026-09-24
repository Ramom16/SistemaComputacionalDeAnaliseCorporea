import { describe, it, expect } from "vitest";
import { DadosCorporais } from "../../src/models/DadosCorporais.js";
import crypto from "crypto";

const UUID_USUARIO = crypto.randomUUID();
const UUID_DADOS = crypto.randomUUID();

// Helper de dados corporais válidos
function dadosValidos(overrides = {}) {
  return {
    idUsuario: overrides.idUsuario ?? UUID_USUARIO,
    peso_kg: overrides.peso_kg ?? 75.5,
    altura_cm: overrides.altura_cm ?? 175,
    genero: overrides.genero ?? "Masculino",
    idade: overrides.idade ?? 28,
    nivel_atividade: overrides.nivel_atividade ?? "Moderado"
  };
}

describe("Modelo DadosCorporais - criar", () => {
  it("deve criar dados corporais válidos com UUID", () => {
    const d = DadosCorporais.criar(dadosValidos());
    expect(d.idUsuario).toBe(UUID_USUARIO);
    expect(d.peso_kg).toBe(75.5);
    expect(d.altura_cm).toBe(175);
    expect(d.genero).toBe("Masculino");
    expect(d.idDados).toBeNull();
  });

  it("deve criar para gênero Feminino", () => {
    const d = DadosCorporais.criar(dadosValidos({ genero: "Feminino" }));
    expect(d.genero).toBe("Feminino");
  });

  it("deve criar para gênero Outro", () => {
    const d = DadosCorporais.criar(dadosValidos({ genero: "Outro" }));
    expect(d.genero).toBe("Outro");
  });

  it("deve lançar erro se idUsuario estiver faltando", () => {
    // Passa objeto sem o campo idUsuario — o setter rejeita valores falsy
    expect(() => DadosCorporais.criar({
      peso_kg: 70,
      altura_cm: 170,
      genero: "Masculino",
      idade: 25,
      nivel_atividade: "Moderado"
    })).toThrow();
  });

  it("deve lançar erro se peso_kg estiver faltando", () => {
    expect(() => DadosCorporais.criar({ ...dadosValidos(), peso_kg: undefined })).toThrow();
  });
});

describe("Modelo DadosCorporais - setter idUsuario", () => {
  it("deve rejeitar idUsuario numérico", () => {
    expect(() => DadosCorporais.criar(dadosValidos({ idUsuario: "999" }))).toThrow(
      "ID do usuário deve ser um UUID válido"
    );
  });

  it("deve rejeitar idUsuario SQL injection", () => {
    expect(() => DadosCorporais.criar(dadosValidos({ idUsuario: "'; DROP TABLE--" }))).toThrow();
  });

  it("deve aceitar UUID v4 válido", () => {
    const uuid = crypto.randomUUID();
    const d = DadosCorporais.criar(dadosValidos({ idUsuario: uuid }));
    expect(d.idUsuario).toBe(uuid);
  });
});

describe("Modelo DadosCorporais - setter peso_kg", () => {
  it("deve rejeitar peso zero", () => {
    expect(() => DadosCorporais.criar(dadosValidos({ peso_kg: 0 }))).toThrow("Peso inválido");
  });

  it("deve rejeitar peso negativo", () => {
    expect(() => DadosCorporais.criar(dadosValidos({ peso_kg: -10 }))).toThrow("Peso inválido");
  });

  it("deve rejeitar peso acima de 500kg", () => {
    expect(() => DadosCorporais.criar(dadosValidos({ peso_kg: 501 }))).toThrow("Peso inválido");
  });

  it("deve aceitar peso no limite superior (500)", () => {
    const d = DadosCorporais.criar(dadosValidos({ peso_kg: 500 }));
    expect(d.peso_kg).toBe(500);
  });

  it("deve aceitar peso decimal válido", () => {
    const d = DadosCorporais.criar(dadosValidos({ peso_kg: 55.3 }));
    expect(d.peso_kg).toBe(55.3);
  });
});

describe("Modelo DadosCorporais - setter altura_cm", () => {
  it("deve rejeitar altura zero", () => {
    expect(() => DadosCorporais.criar(dadosValidos({ altura_cm: 0 }))).toThrow("Altura inválida");
  });

  it("deve rejeitar altura negativa", () => {
    expect(() => DadosCorporais.criar(dadosValidos({ altura_cm: -5 }))).toThrow("Altura inválida");
  });

  it("deve rejeitar altura acima de 300cm", () => {
    expect(() => DadosCorporais.criar(dadosValidos({ altura_cm: 301 }))).toThrow("Altura inválida");
  });

  it("deve aceitar altura válida", () => {
    const d = DadosCorporais.criar(dadosValidos({ altura_cm: 168 }));
    expect(d.altura_cm).toBe(168);
  });
});

describe("Modelo DadosCorporais - setter genero", () => {
  it("deve rejeitar gênero inválido", () => {
    expect(() => DadosCorporais.criar(dadosValidos({ genero: "Extraterrestre" }))).toThrow(
      "Gênero inválido"
    );
  });

  it("deve rejeitar gênero numérico", () => {
    expect(() => DadosCorporais.criar(dadosValidos({ genero: 1 }))).toThrow();
  });
});

describe("Modelo DadosCorporais - setter idade", () => {
  it("deve rejeitar idade zero", () => {
    expect(() => DadosCorporais.criar(dadosValidos({ idade: 0 }))).toThrow("Idade inválida");
  });

  it("deve rejeitar idade acima de 130", () => {
    expect(() => DadosCorporais.criar(dadosValidos({ idade: 131 }))).toThrow("Idade inválida");
  });

  it("deve rejeitar idade decimal", () => {
    expect(() => DadosCorporais.criar(dadosValidos({ idade: 25.5 }))).toThrow("Idade inválida");
  });

  it("deve aceitar idade 1 (mínimo válido)", () => {
    const d = DadosCorporais.criar(dadosValidos({ idade: 1 }));
    expect(d.idade).toBe(1);
  });
});

describe("Modelo DadosCorporais - setter nivel_atividade", () => {
  it("deve aceitar todos os níveis válidos", () => {
    const niveis = ["Sedentario", "Leve", "Moderado", "Intenso", "MuitoIntenso"];
    for (const nivel of niveis) {
      const d = DadosCorporais.criar(dadosValidos({ nivel_atividade: nivel }));
      expect(d.nivel_atividade).toBe(nivel);
    }
  });

  it("deve rejeitar nível inválido", () => {
    expect(() => DadosCorporais.criar(dadosValidos({ nivel_atividade: "Hyperativo" }))).toThrow(
      "Nível de atividade inválido"
    );
  });
});

describe("Modelo DadosCorporais - método editar", () => {
  it("deve criar instância com idDados via editar", () => {
    const d = DadosCorporais.editar({
      idDados: UUID_DADOS,
      idUsuario: UUID_USUARIO,
      peso_kg: 80,
      altura_cm: 180,
      genero: "Masculino",
      idade: 30,
      nivel_atividade: "Intenso",
      data_registro_Inicial: null,
      data_atualizacao_dados: null
    });
    expect(d.idDados).toBe(UUID_DADOS);
    expect(d.peso_kg).toBe(80);
  });

  it("deve lançar erro se idDados estiver ausente no editar", () => {
    expect(() => DadosCorporais.editar({
      idDados: null,
      idUsuario: UUID_USUARIO,
      peso_kg: 80,
      altura_cm: 180,
      genero: "Masculino",
      idade: 30,
      nivel_atividade: "Intenso"
    })).toThrow("ID dos dados corporais é obrigatório");
  });
});
