/**
 * Testes de integração – fluxos completos da api (fetch mockado)
 * Cobre: salvarDadosCorporais (POST→PUT fallback), getHistorico,
 *        getEstatisticas, getTreinos, salvarPushToken
 */

jest.mock("../config/apiConfig", () => ({ API_BASE_URL: "http://localhost:3000" }));
jest.mock("react-native", () => ({ Platform: { OS: "android" } }));

import { api, setAuthToken } from "../services/api.js";

function mockFetch(body, status = 200) {
  global.fetch.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => "application/json" },
    json: async () => body,
    text: async () => JSON.stringify(body),
  });
}

beforeEach(() => {
  global.fetch = jest.fn();
  setAuthToken("token-de-teste");
});

afterEach(() => {
  jest.restoreAllMocks();
  setAuthToken(null);
});

// ────────────────────────────────────────────────
// salvarDadosCorporais
// ────────────────────────────────────────────────
describe("api.salvarDadosCorporais", () => {
  const dados = {
    peso_kg: 75, altura_cm: 175, idade: 28,
    genero: "masculino", nivel_atividade: "moderado",
  };

  test("usa POST no primeiro cadastro", async () => {
    mockFetch({ idDados: "d1", idUsuario: "1" });

    await api.salvarDadosCorporais(dados, "1");

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toContain("/dadosCorporais");
    expect(options.method).toBe("POST");
  });

  test("faz fallback para PUT quando POST retorna 400 com mensagem 'já possui dados'", async () => {
    // 1ª chamada (POST) → 400
    mockFetch({ erro: "Usuário já possui dados corporais cadastrados." }, 400);
    // 2ª chamada (PUT) → 200
    mockFetch({ idDados: "d1", idUsuario: "1" });

    await api.salvarDadosCorporais(dados, "1");

    expect(global.fetch).toHaveBeenCalledTimes(2);
    const putOptions = global.fetch.mock.calls[1][1];
    expect(putOptions.method).toBe("PUT");
  });

  test("envia Authorization header com token", async () => {
    mockFetch({ idDados: "d2" });

    await api.salvarDadosCorporais(dados, "1");

    const headers = global.fetch.mock.calls[0][1].headers;
    expect(headers.Authorization).toBe("Bearer token-de-teste");
  });
});

// ────────────────────────────────────────────────
// getHistorico
// ────────────────────────────────────────────────
describe("api.getHistorico", () => {
  test("chama endpoint correto com id do usuário", async () => {
    mockFetch([{ data: "2026-01-01", tipo: "treino" }]);

    const resultado = await api.getHistorico("42");

    expect(global.fetch.mock.calls[0][0]).toContain("/historico/usuario/42");
    expect(Array.isArray(resultado)).toBe(true);
  });

  test("lança erro quando status 404", async () => {
    mockFetch({ erro: "Usuário não encontrado" }, 404);
    await expect(api.getHistorico("999")).rejects.toThrow();
  });
});

// ────────────────────────────────────────────────
// getEstatisticas
// ────────────────────────────────────────────────
describe("api.getEstatisticas", () => {
  test("retorna dados de evolução do usuário", async () => {
    const payload = { totalTreinos: 10, mediaPeso: 74.5 };
    mockFetch(payload);

    const res = await api.getEstatisticas("1");

    expect(global.fetch.mock.calls[0][0]).toContain("/evolucao/estatisticas/1");
    expect(res).toMatchObject(payload);
  });
});

// ────────────────────────────────────────────────
// getTreinos
// ────────────────────────────────────────────────
describe("api.getTreinos", () => {
  test("retorna array quando resposta é array direto", async () => {
    mockFetch([{ id: 1, nome: "Treino A" }]);
    const res = await api.getTreinos();
    expect(Array.isArray(res)).toBe(true);
    expect(res[0].nome).toBe("Treino A");
  });

  test("retorna array quando resposta está em data.treinos", async () => {
    mockFetch({ treinos: [{ id: 2, nome: "Treino B" }] });
    const res = await api.getTreinos();
    expect(Array.isArray(res)).toBe(true);
  });

  test("retorna [] quando resposta está vazia", async () => {
    mockFetch({});
    const res = await api.getTreinos();
    expect(res).toEqual([]);
  });
});

// ────────────────────────────────────────────────
// salvarPushToken
// ────────────────────────────────────────────────
describe("api.salvarPushToken", () => {
  test("envia pushToken e fcmToken via PUT", async () => {
    mockFetch({ msg: "ok" });

    await api.salvarPushToken("expo-token-abc", "fcm-token-xyz");

    const [url, options] = global.fetch.mock.calls[0];
    const body = JSON.parse(options.body);

    expect(url).toContain("/usuarios/push-token");
    expect(options.method).toBe("PUT");
    expect(body.pushToken).toBe("expo-token-abc");
    expect(body.fcmToken).toBe("fcm-token-xyz");
  });

  test("envia null para desvincular token no logout", async () => {
    mockFetch({ msg: "ok" });

    await api.salvarPushToken(null, null);

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.pushToken).toBeNull();
    expect(body.fcmToken).toBeNull();
  });
});

// ────────────────────────────────────────────────
// Endpoint getMe
// ────────────────────────────────────────────────
describe("api.getMe", () => {
  test("chama /auth/me com token", async () => {
    mockFetch({ usuario: { id: "1", nome: "A" } });

    await api.getMe();

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toContain("/auth/me");
    expect(options.headers.Authorization).toBe("Bearer token-de-teste");
  });
});

// ────────────────────────────────────────────────
// solicitarRecuperacaoSenha
// ────────────────────────────────────────────────
describe("api.solicitarRecuperacaoSenha", () => {
  test("normaliza email e chama endpoint correto", async () => {
    mockFetch({ msg: "Enviado" });

    await api.solicitarRecuperacaoSenha("User@Email.COM");

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.email).toBe("user@email.com");
  });
});
