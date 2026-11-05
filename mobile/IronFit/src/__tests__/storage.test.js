/**
 * Testes unitários – src/utils/storage.js
 * Cobre: getItem, setItem, removeItem (AsyncStorage + fallback localStorage)
 */

// ---- Mock AsyncStorage nativo ----
const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);
jest.mock("react-native", () => ({ Platform: { OS: "android" } }));

import storage from "../utils/storage.js";

describe("storage.getItem", () => {
  beforeEach(() => jest.clearAllMocks());

  test("retorna valor do AsyncStorage quando disponível", async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce("valor-salvo");
    const resultado = await storage.getItem("@ironfit:token");
    expect(mockAsyncStorage.getItem).toHaveBeenCalledWith("@ironfit:token");
    expect(resultado).toBe("valor-salvo");
  });

  test("retorna null quando AsyncStorage não possui a chave", async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(null);
    const resultado = await storage.getItem("@ironfit:token");
    expect(resultado).toBeNull();
  });

  test("usa fallback quando AsyncStorage lança erro", async () => {
    mockAsyncStorage.getItem.mockRejectedValueOnce(new Error("Native error"));
    // fallback sem window → retorna null
    const resultado = await storage.getItem("@ironfit:token");
    expect(resultado).toBeNull();
  });
});

describe("storage.setItem", () => {
  beforeEach(() => jest.clearAllMocks());

  test("salva valor no AsyncStorage", async () => {
    mockAsyncStorage.setItem.mockResolvedValueOnce(undefined);
    await storage.setItem("@ironfit:token", "jwt-xyz");
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith("@ironfit:token", "jwt-xyz");
  });

  test("não lança quando AsyncStorage falha (usa fallback silencioso)", async () => {
    mockAsyncStorage.setItem.mockRejectedValueOnce(new Error("fail"));
    await expect(storage.setItem("@ironfit:token", "val")).resolves.not.toThrow();
  });
});

describe("storage.removeItem", () => {
  beforeEach(() => jest.clearAllMocks());

  test("remove item do AsyncStorage", async () => {
    mockAsyncStorage.removeItem.mockResolvedValueOnce(undefined);
    await storage.removeItem("@ironfit:token");
    expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith("@ironfit:token");
  });

  test("não lança quando AsyncStorage falha (usa fallback)", async () => {
    mockAsyncStorage.removeItem.mockRejectedValueOnce(new Error("fail"));
    await expect(storage.removeItem("@ironfit:token")).resolves.not.toThrow();
  });
});
