**Front-end**

- **Descrição:** Aplicação front-end em React + Vite para o sistema de análise corporal.

**Tecnologias**

- **Framework:** React (v19)
- **Bundler / Dev server:** Vite
- **UI:** Material UI (@mui)
- **HTTP:** Axios (configurado em `src/services/api.js`)
- **Roteamento:** React Router
- **Gráficos:** Recharts

**Instalação e execução**

- Instalar dependências:

	```bash
	npm install
	```

- Rodar em desenvolvimento:

	```bash
	npm run dev
	```

- Build de produção:

	```bash
	npm run build
	```

- Pré-visualizar build:

	```bash
	npm run preview
	```

- Lint (ESLint):

	```bash
	npm run lint
	```

**Configuração / Variáveis de ambiente**

- A API base é configurada pela variável `VITE_API_URL` (arquivo `.env` do front). Padrão: `http://localhost:3000`.
- O front guarda o JWT em `localStorage` e o envia automaticamente via header `Authorization: Bearer <token>` (ver `src/services/api.js`).

**Rotas públicas e protegidas (no cliente)**

- `/` - Landing page
- `/login` - Login
- `/cadastro` - Cadastro de usuário
- `/recuperar-senha` - Solicitar recuperação
- `/redefinir-senha` - Página para redefinir senha via token
- `/verificar-email` - Página de confirmação de e-mail

Rotas protegidas (exigem autenticação):

- `/dashboard` - Painel principal
- `/meus-treinos` - Lista de treinos do usuário
- `/treino/:id` - Detalhes do treino
- `/evolucao` - Visualização de evolução e estatísticas

**Integração com o Back-end**

- O front consome a API REST do back-end via `axios` (arquivo `src/services/api.js`).
- A aplicação espera endpoints como `/auth`, `/usuarios`, `/dadosCorporais`, `/treinos`, `/exercicios`, `/evolucao` (ver README do back-end para detalhes).

**Observações**

- Não altere nem sincronize manualmente tokens no código: utilize os fluxos de login/logout da aplicação.
- Para testes locais, execute o back-end em `http://localhost:3000` ou ajuste `VITE_API_URL` para apontar para a URL do servidor.
