# Testes do IronFit (Jest)

## Estrutura

```
src/__tests__/
├── api.test.js           # Testes unitários: utilitários puros da api.js
├── apiIntegration.test.js# Testes de integração: endpoints HTTP (fetch mockado)
├── authContext.test.js   # Testes de integração: AuthContext (login, logout, etc.)
└── storage.test.js       # Testes unitários: storage.js (AsyncStorage)
```

## Executar

```bash
# Todos os testes
npm test

# Modo watch (dev)
npm run test:watch

# Com cobertura de código
npm run test:coverage
```

## Cobertura atual

| Módulo                  | Testes                                                                     |
|------------------------|----------------------------------------------------------------------------|
| `services/api.js`       | formatarDataParaISO, normalizarGenero, normalizarNivel, calcularMetabolismo, token, login, register |
| `utils/storage.js`      | getItem, setItem, removeItem (AsyncStorage + fallback)                     |
| `context/AuthContext`   | login, register, logout, adicionarAvaliacao, alterarSenha, recuperação     |
| Integração HTTP         | salvarDadosCorporais (POST→PUT), historico, estatisticas, treinos, push    |
