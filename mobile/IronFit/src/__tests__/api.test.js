/**
 * Testes unitários – src/services/api.js
 * Cobre: formatarDataParaISO, normalizarGenero, normalizarNivelAtividade,
 *        calcularMetabolismo, setAuthToken/getAuthToken
 */

// ---- mocks de módulos nativos / expo antes de qualquer import ----
jest.mock("../config/apiConfig", () => ({
  API_BASE_URL: "http://localhost:3000",
}));

jest.mock("react-native", () => ({
  Platform: { OS: "android" },
}));

import {
  formatarDataParaISO,
  normalizarGeneroParaBackend,
  normalizarNivelAtividadeParaBackend,
  calcularMetabolismo,
  setAuthToken,
  getAuthToken,
  api,
} from "../services/api.js";

// ────────────────────────────────────────────────
// 1. formatarDataParaISO
// ────────────────────────────────────────────────
describe("formatarDataParaISO", () => {
  test("retorna null quando valor é falsy", () => {
    expect(formatarDataParaISO(null)).toBeNull();
    expect(formatarDataParaISO("")).toBeNull();
  });

  test("mantém formato YYYY-MM-DD sem alteração", () => {
    expect(formatarDataParaISO("2000-05-20")).toBe("2000-05-20");
  });

  test("converte DD/MM/AAAA para YYYY-MM-DD", () => {
    expect(formatarDataParaISO("20/05/2000")).toBe("2000-05-20");
  });

  test("converte DD-MM-AAAA para YYYY-MM-DD", () => {
    expect(formatarDataParaISO("20-05-2000")).toBe("2000-05-20");
  });

  test("preenche mês e dia com zero à esquerda", () => {
    expect(formatarDataParaISO("5/1/2000")).toBe("2000-01-05");
  });
});

// ────────────────────────────────────────────────
// 2. normalizarGeneroParaBackend
// ────────────────────────────────────────────────
describe("normalizarGeneroParaBackend", () => {
  test("reconhece feminino independente de caixa", () => {
    expect(normalizarGeneroParaBackend("feminino")).toBe("Feminino");
    expect(normalizarGeneroParaBackend("FEMININO")).toBe("Feminino");
    expect(normalizarGeneroParaBackend("fem")).toBe("Feminino");
  });

  test("reconhece outro", () => {
    expect(normalizarGeneroParaBackend("outro")).toBe("Outro");
    expect(normalizarGeneroParaBackend("Outro")).toBe("Outro");
  });

  test("default é Masculino", () => {
    expect(normalizarGeneroParaBackend("masculino")).toBe("Masculino");
    expect(normalizarGeneroParaBackend("")).toBe("Masculino");
    expect(normalizarGeneroParaBackend(null)).toBe("Masculino");
  });
});

// ────────────────────────────────────────────────
// 3. normalizarNivelAtividadeParaBackend
// ────────────────────────────────────────────────
describe("normalizarNivelAtividadeParaBackend", () => {
  const casos = [
    ["sedentario", "Sedentario"],
    ["leve", "Leve"],
    ["moderado", "Moderado"],
    ["intenso", "Intenso"],
    ["muito_intenso", "MuitoIntenso"],
    ["muitointenso", "MuitoIntenso"],
  ];

  test.each(casos)("'%s' → '%s'", (entrada, esperado) => {
    expect(normalizarNivelAtividadeParaBackend(entrada)).toBe(esperado);
  });

  test("valor desconhecido retorna Moderado", () => {
    expect(normalizarNivelAtividadeParaBackend("ativo")).toBe("Moderado");
    expect(normalizarNivelAtividadeParaBackend("")).toBe("Moderado");
  });
});

// ────────────────────────────────────────────────
// 4. calcularMetabolismo
// ────────────────────────────────────────────────
describe("calcularMetabolismo", () => {
  const baseMasc = { peso: 80, altura: 180, idade: 30, genero: "masculino", nivelAtividade: "moderado" };
  const baseFem  = { peso: 60, altura: 165, idade: 25, genero: "feminino",  nivelAtividade: "leve"     };

  test("retorna null quando falta dado obrigatório", () => {
    expect(calcularMetabolismo({ peso: null, altura: 170, idade: 25, genero: "masculino", nivelAtividade: "leve" })).toBeNull();
    expect(calcularMetabolismo({ peso: 70, altura: null, idade: 25, genero: "masculino", nivelAtividade: "leve" })).toBeNull();
    expect(calcularMetabolismo({ peso: 70, altura: 170, idade: null, genero: "masculino", nivelAtividade: "leve" })).toBeNull();
  });

  test("retorna objeto com imc, tmb, ndc e classificacaoImc", () => {
    const resultado = calcularMetabolismo(baseMasc);
    expect(resultado).not.toBeNull();
    expect(resultado).toHaveProperty("imc");
    expect(resultado).toHaveProperty("tmb");
    expect(resultado).toHaveProperty("ndc");
    expect(resultado).toHaveProperty("classificacaoImc");
  });

  test("IMC masculino calculado corretamente (80 / 1.80²)", () => {
    const { imc } = calcularMetabolismo(baseMasc);
    expect(imc).toBeCloseTo(80 / (1.80 * 1.80), 1);
  });

  test("IMC feminino calculado corretamente (60 / 1.65²)", () => {
    const { imc } = calcularMetabolismo(baseFem);
    expect(imc).toBeCloseTo(60 / (1.65 * 1.65), 1);
  });

  test("TMB masculino maior que TMB feminino para mesmos parâmetros básicos", () => {
    const masc = calcularMetabolismo({ ...baseMasc, genero: "masculino" });
    const fem  = calcularMetabolismo({ ...baseMasc, genero: "feminino"  });
    expect(masc.tmb).toBeGreaterThan(fem.tmb);
  });

  test("NDC é maior com nível intenso do que com sedentário", () => {
    const ativo     = calcularMetabolismo({ ...baseMasc, nivelAtividade: "intenso"   });
    const sedentario = calcularMetabolismo({ ...baseMasc, nivelAtividade: "sedentario" });
    expect(ativo.ndc).toBeGreaterThan(sedentario.ndc);
  });

  describe("classificação de IMC", () => {
    const casos = [
      [{ peso: 45, altura: 170, idade: 25, genero: "masculino", nivelAtividade: "moderado" }, "Abaixo do peso"],
      [{ peso: 70, altura: 170, idade: 25, genero: "masculino", nivelAtividade: "moderado" }, "Peso normal"],
      [{ peso: 85, altura: 170, idade: 25, genero: "masculino", nivelAtividade: "moderado" }, "Sobrepeso"],
      [{ peso: 105, altura: 170, idade: 25, genero: "masculino", nivelAtividade: "moderado" }, "Obesidade Grau I"],
      [{ peso: 125, altura: 170, idade: 25, genero: "masculino", nivelAtividade: "moderado" }, "Obesidade Grau II"],
      [{ peso: 150, altura: 170, idade: 25, genero: "masculino", nivelAtividade: "moderado" }, "Obesidade Grau III"],
    ];

    test.each(casos)("IMC com peso=%s → '%s'", (params, expected) => {
      const { classificacaoImc } = calcularMetabolismo(params);
      expect(classificacaoImc).toBe(expected);
    });
  });
});

// ────────────────────────────────────────────────
// 5. setAuthToken / getAuthToken
// ────────────────────────────────────────────────
describe("setAuthToken / getAuthToken", () => {
  afterEach(() => setAuthToken(null));

  test("getAuthToken começa como null", () => {
    setAuthToken(null);
    expect(getAuthToken()).toBeNull();
  });

  test("setAuthToken persiste o token", () => {
    setAuthToken("meu-token-123");
    expect(getAuthToken()).toBe("meu-token-123");
  });

  test("setAuthToken(null) limpa o token", () => {
    setAuthToken("abc");
    setAuthToken(null);
    expect(getAuthToken()).toBeNull();
  });
});

// ────────────────────────────────────────────────
// 6. api.login (mock de fetch)
// ────────────────────────────────────────────────
describe("api.login", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    setAuthToken(null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    setAuthToken(null);
  });

  function mockFetch(body, status = 200) {
    global.fetch.mockResolvedValueOnce({
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => "application/json" },
      json: async () => body,
      text: async () => JSON.stringify(body),
    });
  }

  test("login bem-sucedido armazena token e retorna resposta", async () => {
    const payload = { token: "jwt-abc", usuario: { id: 1, email: "user@test.com", nome: "User" } };
    mockFetch(payload);

    const result = await api.login("user@test.com", "senha123");

    expect(result.token).toBe("jwt-abc");
    expect(getAuthToken()).toBe("jwt-abc");
  });

  test("login com credenciais inválidas (401) lança erro", async () => {
    mockFetch({ erro: "Credenciais inválidas" }, 401);

    await expect(api.login("x@x.com", "errado")).rejects.toThrow("Credenciais inválidas");
  });

  test("email é normalizado para minúsculas antes de enviar", async () => {
    const payload = { token: "t", usuario: { id: 1, email: "UPPER@TEST.COM", nome: "U" } };
    mockFetch(payload);

    await api.login("UPPER@TEST.COM", "pw");

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.email).toBe("upper@test.com");
  });

  test("timeout de 10s aborta e lança erro 408", async () => {
    // Simula fetch que nunca resolve
    global.fetch.mockImplementationOnce(
      () => new Promise(() => {}) // nunca resolve
    );

    jest.useFakeTimers();
    const promise = api.login("a@a.com", "pw");
    jest.advanceTimersByTime(11000);
    jest.useRealTimers();

    await expect(promise).rejects.toMatchObject({ status: 408 });
  }, 15000);
});

// ────────────────────────────────────────────────
// 7. api.register
// ────────────────────────────────────────────────
describe("api.register", () => {
  beforeEach(() => { global.fetch = jest.fn(); });
  afterEach(() => jest.restoreAllMocks());

  function mockFetch(body, status = 200) {
    global.fetch.mockResolvedValueOnce({
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => "application/json" },
      json: async () => body,
      text: async () => JSON.stringify(body),
    });
  }

  test("converte data DD/MM/AAAA para ISO antes de enviar", async () => {
    mockFetch({ msg: "Conta criada" });

    await api.register({
      nome: "João",
      email: "joao@test.com",
      senha: "S3cur@",
      dataNascimento: "15/08/1995",
    });

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.data_nascimento).toBe("1995-08-15");
  });

  test("email é enviado em minúsculas", async () => {
    mockFetch({ msg: "ok" });

    await api.register({ nome: "A", email: "A@B.COM", senha: "pw", dataNascimento: "01/01/2000" });

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.email).toBe("a@b.com");
  });
});
