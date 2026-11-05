/**
 * Testes de integração – AuthContext
 * Cobre: login, register, logout, adicionarAvaliacao, alterarSenha,
 *        solicitarRecuperacao, reenviarEmail, useAuth fora do Provider
 */

jest.mock("../config/apiConfig", () => ({ API_BASE_URL: "http://localhost:3000" }));
jest.mock("react-native", () => ({ Platform: { OS: "android" } }));

// Mock AsyncStorage
const asyncStorageMock = {
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
};
jest.mock("@react-native-async-storage/async-storage", () => asyncStorageMock);

// Mock notificationService (evita acesso ao hardware)
jest.mock("../notifications/notificationService", () => ({
  registrarParaPushNotificationsAsync: jest.fn().mockResolvedValue({
    expoPushToken: null,
    fcmDeviceToken: null,
  }),
}));

// Mock global fetch
global.fetch = jest.fn();

function mockFetch(body, status = 200) {
  global.fetch.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => "application/json" },
    json: async () => body,
    text: async () => JSON.stringify(body),
  });
}

import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import { AuthProvider, useAuth } from "../context/AuthContext.jsx";

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

// ─── utilidade para pular a inicialização ───
async function renderAuthHook() {
  // O hook chama api.getMe durante init quando há token;
  // como AsyncStorage retorna null, a sessão não é restaurada.
  const hook = renderHook(() => useAuth(), { wrapper });
  // Aguarda o ciclo de inicialização (initializing → false)
  await act(async () => {});
  return hook;
}

// 1. login
describe("AuthContext.login", () => {
  beforeEach(() => jest.clearAllMocks());

  test("login bem-sucedido define user, token e signed=true", async () => {
    const { result } = await renderAuthHook();

    mockFetch({ token: "jwt-ok", usuario: { id: "1", nome: "João", email: "j@test.com" } });
    // getDadosCorporais após login
    mockFetch([]);

    await act(async () => {
      const res = await result.current.login("j@test.com", "senha");
      expect(res.success).toBe(true);
    });

    expect(result.current.signed).toBe(true);
    expect(result.current.token).toBe("jwt-ok");
    expect(result.current.user).toMatchObject({ id: "1", nome: "João" });
  });

  test("login com erro de rede retorna success=false", async () => {
    const { result } = await renderAuthHook();

    global.fetch.mockRejectedValueOnce(new Error("Network Error"));

    await act(async () => {
      const res = await result.current.login("x@x.com", "pw");
      expect(res.success).toBe(false);
      expect(res.error).toContain("Network Error");
    });

    expect(result.current.signed).toBe(false);
  });

  test("login com status 401 retorna success=false", async () => {
    const { result } = await renderAuthHook();

    mockFetch({ erro: "Credenciais inválidas" }, 401);

    await act(async () => {
      const res = await result.current.login("x@x.com", "errada");
      expect(res.success).toBe(false);
    });
  });
});

// 2. register
describe("AuthContext.register", () => {
  beforeEach(() => jest.clearAllMocks());

  test("registro bem-sucedido retorna success=true e mensagem", async () => {
    const { result } = await renderAuthHook();

    mockFetch({ msg: "Conta criada! Verifique seu e-mail." });

    await act(async () => {
      const res = await result.current.register({
        nome: "Maria",
        email: "maria@test.com",
        senha: "Senha@1",
        dataNascimento: "01/01/2000",
      });
      expect(res.success).toBe(true);
      expect(res.message).toContain("Conta criada");
    });
  });

  test("erro no registro retorna success=false", async () => {
    const { result } = await renderAuthHook();

    mockFetch({ erro: "E-mail já cadastrado" }, 400);

    await act(async () => {
      const res = await result.current.register({
        nome: "Dup",
        email: "dup@test.com",
        senha: "pw",
        dataNascimento: "01/01/1990",
      });
      expect(res.success).toBe(false);
    });
  });
});

// 3. logout
describe("AuthContext.logout", () => {
  beforeEach(() => jest.clearAllMocks());

  test("logout limpa user, token e signed", async () => {
    const { result } = await renderAuthHook();

    // Fazer login primeiro
    mockFetch({ token: "jwt", usuario: { id: "1", nome: "A", email: "a@a.com" } });
    mockFetch([]); // getDadosCorporais
    await act(async () => { await result.current.login("a@a.com", "pw"); });

    expect(result.current.signed).toBe(true);

    // Logout (tenta desvincular push token)
    mockFetch({}); // salvarPushToken
    await act(async () => { await result.current.logout(); });

    expect(result.current.signed).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  test("logout funciona mesmo quando o backend falha", async () => {
    const { result } = await renderAuthHook();

    mockFetch({ token: "jwt", usuario: { id: "2", nome: "B", email: "b@b.com" } });
    mockFetch([]); // getDadosCorporais
    await act(async () => { await result.current.login("b@b.com", "pw"); });

    global.fetch.mockRejectedValueOnce(new Error("offline")); // salvarPushToken falha
    await act(async () => { await result.current.logout(); });

    expect(result.current.signed).toBe(false);
  });
});

// 4. adicionarAvaliacao
describe("AuthContext.adicionarAvaliacao", () => {
  beforeEach(() => jest.clearAllMocks());

  async function loginAndGet() {
    const hook = await renderAuthHook();
    mockFetch({ token: "jwt", usuario: { id: "10", nome: "C", email: "c@c.com" } });
    mockFetch([]); // getDadosCorporais
    await act(async () => { await hook.result.current.login("c@c.com", "pw"); });
    return hook;
  }

  test("adiciona avaliação e retorna success=true", async () => {
    const { result } = await loginAndGet();

    mockFetch({ idDados: "d1", idUsuario: "10" }); // salvarDadosCorporais

    const avaliacao = {
      peso_kg: 75, altura_cm: 175, idade: 28,
      genero: "masculino", nivel_atividade: "moderado",
    };

    await act(async () => {
      const res = await result.current.adicionarAvaliacao(avaliacao);
      expect(res.success).toBe(true);
      expect(res.registro).toBeDefined();
    });

    expect(result.current.dadosCorporais.length).toBeGreaterThan(0);
  });

  test("salva avaliação localmente quando backend falha", async () => {
    const { result } = await loginAndGet();

    global.fetch.mockRejectedValueOnce(new Error("offline")); // salvarDadosCorporais falha

    const avaliacao = {
      peso_kg: 70, altura_cm: 170, idade: 30,
      genero: "feminino", nivel_atividade: "leve",
    };

    await act(async () => {
      const res = await result.current.adicionarAvaliacao(avaliacao);
      expect(res.success).toBe(true); // salva localmente
    });

    expect(result.current.dadosCorporais.length).toBeGreaterThan(0);
  });

  test("avaliação contém imc, tmb e ndc calculados", async () => {
    const { result } = await loginAndGet();

    global.fetch.mockRejectedValueOnce(new Error("offline"));

    const avaliacao = {
      peso_kg: 80, altura_cm: 180, idade: 30,
      genero: "masculino", nivel_atividade: "intenso",
    };

    let registro;
    await act(async () => {
      const res = await result.current.adicionarAvaliacao(avaliacao);
      registro = res.registro;
    });

    expect(registro.imc).toBeDefined();
    expect(registro.tmb).toBeDefined();
    expect(registro.ndc).toBeDefined();
  });
});

// 5. alterarSenha
describe("AuthContext.alterarSenha", () => {
  beforeEach(() => jest.clearAllMocks());

  test("retorna success=true quando backend confirma", async () => {
    const { result } = await renderAuthHook();

    mockFetch({ msg: "Senha alterada com sucesso!" });

    await act(async () => {
      const res = await result.current.alterarSenha("velha", "nova123");
      expect(res.success).toBe(true);
      expect(res.message).toContain("Senha alterada");
    });
  });

  test("retorna success=false quando backend rejeita", async () => {
    const { result } = await renderAuthHook();

    mockFetch({ erro: "Senha atual incorreta" }, 400);

    await act(async () => {
      const res = await result.current.alterarSenha("errada", "nova");
      expect(res.success).toBe(false);
    });
  });
});

// 6. solicitarRecuperacao
describe("AuthContext.solicitarRecuperacao", () => {
  beforeEach(() => jest.clearAllMocks());

  test("envia email e retorna success=true", async () => {
    const { result } = await renderAuthHook();

    mockFetch({ msg: "Instruções enviadas." });

    await act(async () => {
      const res = await result.current.solicitarRecuperacao("user@test.com");
      expect(res.success).toBe(true);
    });
  });
});

// 7. reenviarEmail
describe("AuthContext.reenviarEmail", () => {
  beforeEach(() => jest.clearAllMocks());

  test("envia reenvio e retorna success=true", async () => {
    const { result } = await renderAuthHook();

    mockFetch({ msg: "Novo link enviado." });

    await act(async () => {
      const res = await result.current.reenviarEmail("user@test.com");
      expect(res.success).toBe(true);
    });
  });
});

// 8. useAuth fora do Provider
describe("useAuth fora do AuthProvider", () => {
  test("lança erro descritivo quando usado fora do provider", () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth deve ser utilizado dentro de um AuthProvider");
  });
});
