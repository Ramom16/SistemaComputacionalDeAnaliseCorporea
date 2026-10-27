import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  enviarEmailVerificacao,
  enviarEmailRecuperacaoSenha,
  enviarEmaildeContaDesativada,
  enviarEmaildeContaReativada
} from "../../src/services/emailService.js";

beforeEach(() => {
  vi.stubEnv("BREVO_API_KEY", "xkeysib-test");
  vi.stubEnv("EMAIL_FROM", "noreply@example.com");
  vi.stubEnv("EMAIL_FROM_NAME", "IRONFIT");
  vi.stubEnv("SUPPORT_EMAIL", "suporte@example.com");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true,
    status: 201,
    json: vi.fn().mockResolvedValue({ messageId: "email-id" })
  }));
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("emailService", () => {
  it.each([
    ["verificação", () => enviarEmailVerificacao("user@example.com", "https://example.com/verify")],
    ["recuperação de senha", () => enviarEmailRecuperacaoSenha("user@example.com", "https://example.com/reset")],
    ["desativação de conta", () => enviarEmaildeContaDesativada("user@example.com", "Atleta")],
    ["reativação de conta", () => enviarEmaildeContaReativada("user@example.com", "Atleta")]
  ])("envia o e-mail de %s pela Brevo", async (_tipo, enviar) => {
    await enviar();

    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith(
      "https://api.brevo.com/v3/smtp/email",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "api-key": "xkeysib-test" }),
        body: expect.any(String)
      })
    );

    const requestBody = JSON.parse(fetch.mock.calls[0][1].body);
    expect(requestBody.sender).toEqual({ email: "noreply@example.com", name: "IRONFIT" });
    expect(requestBody.to).toEqual([{ email: "user@example.com" }]);
    expect(requestBody.htmlContent).toContain("IRONFIT");
  });

  it("falha com mensagem clara quando a chave da Brevo não está configurada", async () => {
    vi.stubEnv("BREVO_API_KEY", "");

    await expect(enviarEmailVerificacao("user@example.com", "https://example.com/verify"))
      .rejects.toThrow("BREVO_API_KEY não definido no ambiente.");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("aceita o formato de remetente usado anteriormente", async () => {
    vi.stubEnv("EMAIL_FROM", '"IRONFIT Mail" <noreply@example.com>');
    vi.stubEnv("EMAIL_FROM_NAME", "");

    await enviarEmailVerificacao("user@example.com", "https://example.com/verify");

    const requestBody = JSON.parse(fetch.mock.calls[0][1].body);
    expect(requestBody.sender).toEqual({ email: "noreply@example.com", name: "IRONFIT Mail" });
  });

  it("propaga erros retornados pela API da Brevo", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: vi.fn().mockResolvedValue({ message: "Chave de API inválida" })
    });
    vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(enviarEmailVerificacao("user@example.com", "https://example.com/verify"))
      .rejects.toThrow("Chave de API inválida");
  });
});
