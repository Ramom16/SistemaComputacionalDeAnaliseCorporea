import { beforeEach, describe, expect, it, vi } from "vitest";
import DadosCorporaisService from "../../src/services/dadosCorporaisService.js";

const { prismaMock, repositoryMock, calculoCreateMock } = vi.hoisted(() => ({
  prismaMock: {
    $transaction: vi.fn()
  },
  repositoryMock: {
    findByUsuario: vi.fn(),
    create: vi.fn()
  },
  calculoCreateMock: vi.fn()
}));

vi.mock("../../src/database/prismaClient.js", () => ({
  default: prismaMock
}));

vi.mock("../../src/repositories/dadosCorporaisRepository.js", () => ({
  default: repositoryMock
}));

const dados = {
  idUsuario: "usuario-id",
  peso_kg: 75,
  altura_cm: 175,
  genero: "Masculino",
  idade: 28,
  nivel_atividade: "Moderado"
};

beforeEach(() => {
  vi.clearAllMocks();
  prismaMock.$transaction.mockImplementation((callback) =>
    callback({ calculo: { create: calculoCreateMock } })
  );
  repositoryMock.findByUsuario.mockResolvedValue(null);
  repositoryMock.create.mockResolvedValue({
    ...dados,
    idDados: "dados-id",
    calculos: [{ idCalculo: "calculo-id" }]
  });
});

describe("DadosCorporaisService - criar", () => {
  it("reutiliza o cálculo criado pelo repositório sem gravar outro", async () => {
    const resultado = await DadosCorporaisService.criar(dados);

    expect(repositoryMock.create).toHaveBeenCalledOnce();
    expect(calculoCreateMock).not.toHaveBeenCalled();
    expect(resultado.calculos.idCalculo).toBe("calculo-id");
    expect(resultado.calculos).toMatchObject({
      imc: expect.any(Number),
      tmb: expect.any(Number),
      ndc: expect.any(Number)
    });
  });
});
