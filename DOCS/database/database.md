# Modelo de Dados — IRONFIT

Este documento apresenta o modelo de banco de dados do sistema, com foco nas entidades e seus relacionamentos. O banco utiliza **MySQL** com o ORM **Prisma**, com IDs no formato `VARCHAR(36)` (UUID).

---

## Entidade: USUARIOS
### Descrição
Representa as pessoas que utilizam o sistema, armazenando credenciais, segurança e status de conta.

### Atributos
- `id` (PK) — UUID VARCHAR(36)
- `nome` — VARCHAR(250), NOT NULL
- `email` — VARCHAR(255), UNIQUE, NOT NULL
- `senha_hash` — VARCHAR(255), NOT NULL
- `data_nascimento` — DATE
- `ativo` — TINYINT(1), default true
- `email_verificado` — TINYINT(1), default false
- `ultimo_login` — DATETIME(3)
- `criado_em` — DATETIME(3)
- `bloqueado_ate` — DATETIME(3) *(proteção contra força bruta)*
- `tentativas_login` — INT, default 0
- `role` — ENUM('ADMIN', 'USER'), default 'USER'

---

## Entidade: PERFIL
### Descrição
Armazena informações de perfil visual do usuário, como foto. Relacionamento 1:1 com `usuarios`.

### Atributos
- `idPerfil` (PK) — UUID VARCHAR(36)
- `fotoPerfil` — VARCHAR(255)
- `idUsuario` (FK, UNIQUE) — VARCHAR(36) → `usuarios.id`

---

## Entidade: DADOS_CORPORAIS
### Descrição
Armazena os dados físicos do usuário, utilizados como base para os cálculos metabólicos. Relacionamento 1:1 com `usuarios`.

### Atributos
- `idDados` (PK) — UUID VARCHAR(36)
- `idUsuario` (FK, UNIQUE) — VARCHAR(191) → `usuarios.id`
- `peso_kg` — DECIMAL(10,2), NOT NULL
- `altura_cm` — DECIMAL(5,2), NOT NULL
- `genero` — ENUM('Masculino', 'Feminino', 'Outro')
- `idade` — INT
- `nivel_atividade` — ENUM('Sedentario', 'Leve', 'Moderado', 'Intenso', 'MuitoIntenso')
- `data_registro_Inicial` — DATETIME(3)
- `data_atualizacao_dados` — DATETIME(3)

---

## Entidade: CALCULOS
### Descrição
Armazena os resultados dos cálculos metabólicos gerados a partir de `dados_corporais`.

### Atributos
- `idCalculo` (PK) — UUID VARCHAR(36)
- `idDados` (FK) — VARCHAR(191) → `dados_corporais.idDados`
- `imc` — DECIMAL(10,2)
- `tmb` — DECIMAL(10,2)
- `ndc` — DECIMAL(10,2)
- `data_calculo` — DATETIME(3)
- `data_atualizacao_calculo` — DATETIME(3)

---

## Entidade: HISTORICO_CORPORAL
### Descrição
Registra snapshots dos dados corporais e metabólicos anteriores do usuário, permitindo rastrear a evolução ao longo do tempo.

### Atributos
- `idHistorico` (PK) — UUID VARCHAR(36)
- `idDados` (FK) — VARCHAR(191) → `dados_corporais.idDados`
- `peso_kg` — DECIMAL(10,2)
- `altura_cm` — DECIMAL(5,2)
- `genero` — ENUM('Masculino', 'Feminino', 'Outro')
- `idade` — INT
- `nivel_atividade` — ENUM('Sedentario', 'Leve', 'Moderado', 'Intenso', 'MuitoIntenso')
- `imc` — DECIMAL(10,2)
- `tmb` — DECIMAL(10,2)
- `ndc` — DECIMAL(10,2)
- `criado_em` — DATETIME(3)

---

## Entidade: TREINOS
### Descrição
Representa os treinos gerados pelo sistema com base nos cálculos e objetivos do usuário. Suporta treinos personalizados e fichas oficiais criadas por administradores.

### Atributos
- `idTreino` (PK) — UUID VARCHAR(36)
- `idCalculo` (FK, nullable) — VARCHAR(191) → `calculos.idCalculo`
- `idUsuario` (FK, nullable) — VARCHAR(191) → `usuarios.id`
- `titulo` — VARCHAR(150)
- `objetivo` — ENUM('Hipertrofia', 'Emagrecimento', 'Resistencia', 'Condicionamento')
- `nivel` — ENUM('Iniciante', 'Intermediario', 'Avancado')
- `is_oficial` — TINYINT(1), default false *(fichas globais criadas por ADMIN)*
- `data_criacao` — DATETIME(3)

---

## Entidade: EXERCICIOS
### Descrição
Catálogo de exercícios físicos disponíveis no sistema, categorizados por grupo muscular.

### Atributos
- `idExercicio` (PK) — UUID VARCHAR(36)
- `nome` — VARCHAR(150)
- `grupo_muscular` — ENUM('Peito', 'Costa', 'Ombro', 'Braço', 'Antebraço', 'Coxa', 'Perna', 'Glúteos', 'Abdomen', 'Cardio')
- `descricao` — VARCHAR(255)
- `caminho_video` — VARCHAR(255)

---

## Entidade: TREINOS_EXERCICIOS
### Descrição
Tabela associativa responsável por relacionar treinos e exercícios, definindo volume (séries/repetições) e tipo de cada exercício no treino.

### Atributos
- `idTreino` (PK, FK) — VARCHAR(191) → `treinos.idTreino`
- `idExercicio` (PK, FK) — VARCHAR(191) → `exercicios.idExercicio`
- `series` — INT
- `repeticoes` — INT
- `descanso_segundos` — INT
- `grupo_muscular` — ENUM('Peito', 'Costa', 'Ombro', 'Braço', 'Antebraço', 'Coxa', 'Perna', 'Glúteos', 'Abdomen', 'Cardio')
- `tipo` — ENUM('Forca', 'Cardio', 'Alongamento', 'Mobilidade')

---

## Entidade: EMAIL_VERIFICATION_TOKENS
### Descrição
Armazena tokens de verificação de conta enviados por e-mail durante o cadastro.

### Atributos
- `id` (PK) — UUID VARCHAR(36)
- `usuarioId` (FK) — VARCHAR(191) → `usuarios.id`
- `token_hash` — VARCHAR(64), UNIQUE *(hash SHA-256 do token)*
- `expira_em` — DATETIME(3)
- `usado_em` — DATETIME(3)
- `criado_em` — DATETIME(3)

---

## Entidade: PASSWORD_RESET_TOKENS
### Descrição
Armazena tokens de redefinição de senha, com validade de 1 hora e invalidados após uso.

### Atributos
- `id` (PK) — UUID VARCHAR(36)
- `usuarioId` (FK) — VARCHAR(191) → `usuarios.id`
- `token_hash` — VARCHAR(64), UNIQUE *(hash SHA-256 do token)*
- `expira_em` — DATETIME(3)
- `usado_em` — DATETIME(3)
- `criado_em` — DATETIME(3)

---

## Relacionamentos

| Tabela Origem | Cardinalidade | Tabela Destino | Chave Estrangeira |
| :--- | :---: | :--- | :--- |
| `usuarios` | **1 : 1** | `perfil` | `perfil.idUsuario` → `usuarios.id` |
| `usuarios` | **1 : 1** | `dados_corporais` | `dados_corporais.idUsuario` → `usuarios.id` |
| `usuarios` | **1 : N** | `email_verification_tokens` | `email_verification_tokens.usuarioId` → `usuarios.id` |
| `usuarios` | **1 : N** | `password_reset_tokens` | `password_reset_tokens.usuarioId` → `usuarios.id` |
| `usuarios` | **1 : N** | `treinos` | `treinos.idUsuario` → `usuarios.id` |
| `dados_corporais` | **1 : N** | `calculos` | `calculos.idDados` → `dados_corporais.idDados` |
| `dados_corporais` | **1 : N** | `historico_corporal` | `historico_corporal.idDados` → `dados_corporais.idDados` |
| `calculos` | **1 : N** | `treinos` | `treinos.idCalculo` → `calculos.idCalculo` |
| `treinos` | **1 : N** | `treinos_exercicios` | `treinos_exercicios.idTreino` → `treinos.idTreino` |
| `exercicios` | **1 : N** | `treinos_exercicios` | `treinos_exercicios.idExercicio` → `exercicios.idExercicio` |

### Observações
- Todas as chaves estrangeiras usam `ON DELETE CASCADE / ON UPDATE CASCADE`
- IDs utilizam UUIDs (VARCHAR 36) gerados pela aplicação via `crypto.randomUUID()`
- A relação entre `treinos` e `exercicios` é muitos-para-muitos, resolvida por `treinos_exercicios`
- `historico_corporal` registra snapshots automáticos a cada atualização de `dados_corporais`
- Contas desativadas usam soft-delete (`ativo = false`) para preservar o histórico do usuário