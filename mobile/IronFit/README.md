#  IronFit Mobile

> **Sistema Computacional de Análise Corpórea**  
> Aplicativo móvel para acompanhamento físico, treinos, avaliações corporais e evolução de alunos/atletas.

---

##  Visão Geral

O **IronFit Mobile** é a interface móvel do ecossistema de Análise Corpórea. O aplicativo permite que usuários monitorem suas métricas físicas, acompanhem treinos prescritos, visualizem a evolução de medidas/bioimpedância e mantenham seus dados cadastrais e de perfil sempre atualizados.

---

##  Tecnologias e Dependências

- **Framework Principal:** [React Native](https://reactnative.dev/) (v0.81.5)
- **Plataforma/Tooling:** [Expo](https://expo.dev/) (SDK ~54.0.36) com Nova Arquitetura (*New Architecture*) habilitada
- **Linguagem:** JavaScript (Node.js)
- **Navegação:** [@react-navigation/native](https://reactnavigation.org/) (v7) & `@react-navigation/native-stack`
- **Build & Distribuição:** [Expo Application Services (EAS Build)](https://expo.dev/eas)
- **Componentes de Sistema:** `react-native-screens`, `react-native-safe-area-context`, `expo-status-bar`

---

##  Estrutura do Projeto

```text
IronFit/
├── assets/                 # Imagens estáticas, ícones e splash screen
├── scripts/                # Scripts utilitários
│   └── help.js             # Guia interativo via terminal (npm run help)
├── src/                    # Código-fonte da aplicação
│   ├── context/            # Estados globais e Context API (ex: AuthContext)
│   ├── navigation/         # Configuração de rotas e stacks de navegação
│   ├── screens/            # Telas da aplicação
│   │   ├── Avaliacao/      # Visualização e registro de avaliações físicas
│   │   ├── Cadastro/       # Fluxo de cadastro de novos usuários
│   │   ├── Evolucao/       # Gráficos e histórico de progresso
│   │   ├── Home/           # Painel principal do usuário
│   │   ├── Landing/        # Tela inicial de boas-vindas / apresentação
│   │   ├── Login/          # Autenticação de usuários
│   │   ├── Perfil/         # Gerenciamento de perfil e dados pessoais
│   │   └── Treinos/        # Fichas e rotinas de exercícios
│   └── services/           # Integrações com APIs externas / back-end
├── App.js                  # Ponto de entrada do React Native / Providers
├── app.json                # Configurações de manifesto do Expo / Android / iOS
├── eas.json                # Configuração de perfis de build (EAS)
├── index.js                # Registro do componente raiz
└── package.json            # Dependências e scripts do projeto
```

---

##  Como Executar o Projeto em Desenvolvimento

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (LTS recomendado).
- Gerenciador de pacotes `npm` ou `yarn`.
- Dispositivo móvel com o aplicativo **Expo Go** instalado ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779)) ou um emulador configurado (Android Studio / Xcode).

### 1. Instalação das dependências
```bash
npm install
```

### 2. Iniciar o servidor de desenvolvimento
```bash
npm start
```
> **Dica:** Caso deseje abrir direto em um ambiente específico:
> - Android: `npm run android`
> - iOS (macOS): `npm run ios`
> - Navegador Web: `npm run web`

### 3. Conectando no celular físico
1. Certifique-se de que o computador e o celular estejam conectados na **mesma rede Wi-Fi**.
2. Abra o app **Expo Go** no celular.
3. Escaneie o QR Code gerado no terminal.

---

##  Configuração e Geração de APK (EAS Build)

O projeto está configurado para gerar builds na nuvem utilizando o **EAS (Expo Application Services)** com perfil de distribuição direta em formato `.apk`.

### 1. Configuração inicial (Primeira execução)
Instale o CLI do EAS e autentique sua conta da Expo:
```bash
npm run apk_config_install
```
*Ou manualmente:*
```bash
npm install -g eas-cli
eas login
```

### 2. Gerar o arquivo APK
Execute o script de build configurado no `eas.json` para o profile `preview`:
```bash
npm run apk
```

> **Comando equivalente:** `eas build --platform android --profile preview`

Ao término da compilação nos servidores do EAS, o terminal fornecerá o link direto para download e um QR Code para instalação imediata no dispositivo Android.

---

##  Scripts Disponíveis

| Script | Comando | Descrição |
| :--- | :--- | :--- |
| `npm start` | `expo start` | Inicia o Metro Bundler do Expo. |
| `npm run android` | `expo start --android` | Inicia e executa no emulador Android conectado. |
| `npm run ios` | `expo start --ios` | Inicia e executa no simulador iOS (somente macOS). |
| `npm run web` | `expo start --web` | Executa a versão web no navegador padrão. |
| `npm run help` | `node ./scripts/help.js` | Exibe o tutorial interativo de comandos no terminal. |
| `npm run apk_config_install` | `npm install -g eas-cli && eas login` | Instala o EAS CLI e realiza autenticação. |
| `npm run apk` | `eas build --platform android --profile preview` | Dispara a compilação do APK Android na nuvem. |

---

##  Identificadores do Aplicativo

- **Android Package:** `com.dcs1lv4steam.IronFit`
- **iOS Bundle Identifier:** `com.dcs1lv4steam.IronFit`
- **EAS Project ID:** `83aad122-0a96-4b7f-9558-678bbd48f7ab`
