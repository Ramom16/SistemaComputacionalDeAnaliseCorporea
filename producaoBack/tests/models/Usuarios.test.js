import { describe, it, expect } from "vitest";
import { Usuario } from "../../src/models/Usuarios.js";
import crypto from "crypto";

const UUID_VALIDO = crypto.randomUUID();
const HASH_VALIDO = "$2b$10$abcdefghijklmnopqrstuvwxyzABCDE12345678901234567890";

// Helper para construir um usuário válido
function criarUsuarioValido(overrides = {}) {
  return new Usuario(
    overrides.nome ?? "João Silva",
    overrides.email ?? "joao@email.com",
    overrides.senha_hash ?? HASH_VALIDO,
    overrides.data_nascimento ?? "1995-06-15",
    overrides.ativo ?? true,
    overrides.email_verificado ?? false,
    overrides.ultimo_login ?? null,
    overrides.criado_em ?? null,
    overrides.bloqueado_ate ?? null,
    overrides.tentativas_login ?? 0,
    overrides.id ?? UUID_VALIDO
  );
}

describe("Modelo Usuario - construção", () => {
  it("deve criar um usuário com todos os campos válidos", () => {
    const u = criarUsuarioValido();
    expect(u.nome).toBe("João Silva");
    expect(u.email).toBe("joao@email.com");
    expect(u.id).toBe(UUID_VALIDO);
    expect(u.ativo).toBe(true);
  });

  it("deve criar um usuário sem ID (novo usuário ainda não salvo)", () => {
    // Usando o factory `criar` que não recebe id
    const u = Usuario.criar({
      nome: "Pedro Novo",
      email: "pedro@email.com",
      senha_hash: HASH_VALIDO,
      data_nascimento: "1990-01-01"
    });
    expect(u.id).toBeNull();
  });

  it("deve normalizar o nome removendo espaços extras", () => {
    const u = criarUsuarioValido({ nome: "  Ana Costa  " });
    expect(u.nome).toBe("Ana Costa");
  });

  it("deve normalizar o email para minúsculas", () => {
    const u = criarUsuarioValido({ email: "USUARIO@GMAIL.COM" });
    expect(u.email).toBe("usuario@gmail.com");
  });
});

describe("Modelo Usuario - setter id", () => {
  it("deve aceitar UUID v4 válido", () => {
    const u = criarUsuarioValido({ id: UUID_VALIDO });
    expect(u.id).toBe(UUID_VALIDO);
  });

  it("deve rejeitar ID numérico (string de dígitos)", () => {
    expect(() => criarUsuarioValido({ id: "123" })).toThrow(
      "ID do usuário deve ser um UUID válido"
    );
  });

  it("deve rejeitar string aleatória sem formato UUID", () => {
    expect(() => criarUsuarioValido({ id: "nao-e-um-uuid-valido" })).toThrow();
  });

  it("deve aceitar id null", () => {
    // O constructor aceita id null sem lançar erro
    const u = new Usuario("Maria", "maria@email.com", HASH_VALIDO, "1990-01-01", true, false, null, null, null, 0, null);
    expect(u.id).toBeNull();
  });
});

describe("Modelo Usuario - setter nome", () => {
  it("deve rejeitar nome com menos de 3 caracteres", () => {
    expect(() => criarUsuarioValido({ nome: "AB" })).toThrow(
      "Nome deve ter entre 3 e 250 caracteres"
    );
  });

  it("deve rejeitar nome com mais de 250 caracteres", () => {
    expect(() => criarUsuarioValido({ nome: "A".repeat(251) })).toThrow(
      "Nome deve ter entre 3 e 250 caracteres"
    );
  });

  it("deve rejeitar nome não-string", () => {
    expect(() => criarUsuarioValido({ nome: 123 })).toThrow();
  });
});

describe("Modelo Usuario - setter email", () => {
  it("deve rejeitar email sem @", () => {
    expect(() => criarUsuarioValido({ email: "emailsemarroba.com" })).toThrow("Email inválido");
  });

  it("deve rejeitar email com menos de 5 caracteres", () => {
    expect(() => criarUsuarioValido({ email: "a@b" })).toThrow("Email inválido");
  });

  it("deve rejeitar email com espaços", () => {
    expect(() => criarUsuarioValido({ email: "usuario @email.com" })).toThrow("Email inválido");
  });
});

describe("Modelo Usuario - setter senha_hash", () => {
  it("deve rejeitar hash com menos de 40 caracteres", () => {
    expect(() => criarUsuarioValido({ senha_hash: "curto" })).toThrow(
      "Hash da senha inválido"
    );
  });
});

describe("Modelo Usuario - setter data_nascimento", () => {
  it("deve rejeitar data de nascimento no futuro", () => {
    expect(() => criarUsuarioValido({ data_nascimento: "2099-01-01" })).toThrow(
      "Data de nascimento não pode ser futura"
    );
  });

  it("deve rejeitar data inválida", () => {
    expect(() => criarUsuarioValido({ data_nascimento: "nao-e-uma-data" })).toThrow(
      "Data de nascimento inválida"
    );
  });

  it("deve aceitar null para data de nascimento", () => {
    // Criar sem sobrescrever data_nascimento padrão do helper — passar diretamente
    const u = new Usuario("Carlos", "carlos@email.com", HASH_VALIDO, null, true, false, null, null, null, 0, null);
    expect(u.data_nascimento).toBeNull();
  });
});

describe("Modelo Usuario - setter tentativas_login", () => {
  it("deve rejeitar tentativas negativas", () => {
    expect(() => criarUsuarioValido({ tentativas_login: -1 })).toThrow(
      "Número de tentativas inválido"
    );
  });

  it("deve aceitar zero como tentativas", () => {
    const u = criarUsuarioValido({ tentativas_login: 0 });
    expect(u.tentativas_login).toBe(0);
  });
});

describe("Modelo Usuario - método estático criar", () => {
  it("deve criar usuário via factory sem ID (null)", () => {
    const u = Usuario.criar({
      nome: "Maria Fernanda",
      email: "maria@empresa.com.br",
      senha_hash: HASH_VALIDO,
      data_nascimento: "1990-08-20"
    });
    expect(u.id).toBeNull();
    expect(u.email_verificado).toBe(false);
    expect(u.ativo).toBe(true);
    expect(u.tentativas_login).toBe(0);
  });
});

describe("Modelo Usuario - método estático editar", () => {
  it("deve criar usuário via editar com UUID como ID", () => {
    const u = Usuario.editar({
      nome: "Carlos",
      email: "carlos@test.com",
      senha_hash: HASH_VALIDO,
      data_nascimento: "1985-03-10",
      ativo: true,
      email_verificado: true,
      ultimo_login: null,
      bloqueado_ate: null,
      tentativas_login: 0
    }, UUID_VALIDO);
    expect(u.id).toBe(UUID_VALIDO);
    expect(u.email_verificado).toBe(true);
  });
});
