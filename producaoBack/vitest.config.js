import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Pasta onde ficam os testes
    include: ["tests/**/*.test.js"],

    // Ambiente de execução (Node para back-end)
    environment: "node",

    // Relatório de cobertura de código
    coverage: {
      provider: "v8",
      include: ["src/**/*.js"],
      exclude: [
        "src/database/**",
        "src/routes/**",
        "src/app.js"
      ],
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage"
    },

    // Exibe cada teste individualmente no console
    reporters: ["verbose"],

    // Configuração de timeout (ms) por teste
    testTimeout: 10000,

    // Variáveis de ambiente para os testes
    env: {
      NODE_ENV: "test",
      JWT_SECRET: "segredo_de_teste_vitest_2026",
      ENCRYPTION_KEY: "chave_de_criptografia_de_teste_vitest_2026"
    },

    // Sequência de setup global (opcional, para futuras configurações)
    globalSetup: [],
    setupFiles: []
  }
});
