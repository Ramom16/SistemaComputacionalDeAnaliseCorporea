/** @type {import("jest").Config} */
module.exports = {
  // Transformador Babel compatível com ESM do Expo
  transform: {
    "^.+\\.[jt]sx?$": ["babel-jest", { configFile: "./babel.config.jest.cjs" }]
  },
  // Deixa os módulos nativos sem transform (evita erros de setup-env do RN)
  transformIgnorePatterns: [
    "node_modules/(?!(@react-native-async-storage|@react-native|react-native|expo|@expo|@testing-library)/)"
  ],
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/*.styles.{js,jsx}"
  ],
  coverageReporters: ["text", "lcov", "html"],
  // Ambiente node puro (sem DOM/RN runtime) — suficiente para lógica de negócio
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // Faz módulos nativos resolverem para mocks automáticos
    "react-native": "<rootDir>/node_modules/react-native"
  },
  setupFilesAfterEnv: [],
  // Garante que imports ESM dos testes sejam transformados
  extensionsToTreatAsEsm: [".jsx"]
};
