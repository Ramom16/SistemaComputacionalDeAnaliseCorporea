# Diagrama Entidade-Relacionamento (DER) - IRONFIT

Este documento contém o modelo conceitual e lógico de dados (DER) do banco de dados relacional `sistematmbndcimc`.

---

## Representação Gráfica

```mermaid
erDiagram
    usuarios ||--o| perfil : "possui (1:1)"
    usuarios ||--o| dados_corporais : "possui (1:1)"
    usuarios ||--o{ email_verification_tokens : "gera (1:N)"
    usuarios ||--o{ password_reset_tokens : "gera (1:N)"
    usuarios ||--o{ treinos : "cria (1:N)"

    dados_corporais ||--o{ calculos : "gera (1:N)"
    dados_corporais ||--o{ historico_corporal : "registra (1:N)"

    calculos ||--o{ treinos : "origina (1:N)"

    treinos ||--|{ treinos_exercicios : "composto_por (1:N)"
    exercicios ||--|{ treinos_exercicios : "incluido_em (1:N)"

    usuarios {
        string id PK "VARCHAR(36)"
        string nome "VARCHAR(250)"
        string email UK "VARCHAR(255)"
        string senha_hash "VARCHAR(255)"
        date data_nascimento "DATE"
        boolean ativo "TINYINT(1)"
        boolean email_verificado "TINYINT(1)"
        datetime ultimo_login "DATETIME(3)"
        datetime criado_em "DATETIME(3)"
        datetime bloqueado_ate "DATETIME(3)"
        int tentativas_login "INT"
        enum role "ENUM('ADMIN', 'USER')"
    }

    perfil {
        string idPerfil PK "VARCHAR(36)"
        string fotoPerfil "VARCHAR(255)"
        string idUsuario FK,UK "VARCHAR(36)"
    }

    dados_corporais {
        string idDados PK "VARCHAR(36)"
        string idUsuario FK,UK "VARCHAR(191)"
        decimal peso_kg "DECIMAL(10,2)"
        decimal altura_cm "DECIMAL(5,2)"
        enum genero "ENUM('Masculino','Feminino','Outro')"
        int idade "INT"
        enum nivel_atividade "ENUM('Sedentario','Leve','Moderado','Intenso','MuitoIntenso')"
        datetime data_atualizacao_dados "DATETIME(3)"
        datetime data_registro_Inicial "DATETIME(3)"
    }

    calculos {
        string idCalculo PK "VARCHAR(36)"
        string idDados FK "VARCHAR(191)"
        decimal imc "DECIMAL(10,2)"
        decimal tmb "DECIMAL(10,2)"
        decimal ndc "DECIMAL(10,2)"
        datetime data_calculo "DATETIME(3)"
        datetime data_atualizacao_calculo "DATETIME(3)"
    }

    historico_corporal {
        string idHistorico PK "VARCHAR(36)"
        string idDados FK "VARCHAR(191)"
        decimal peso_kg "DECIMAL(10,2)"
        decimal altura_cm "DECIMAL(5,2)"
        enum genero "ENUM('Masculino','Feminino','Outro')"
        int idade "INT"
        enum nivel_atividade "ENUM('Sedentario','Leve','Moderado','Intenso','MuitoIntenso')"
        decimal imc "DECIMAL(10,2)"
        decimal tmb "DECIMAL(10,2)"
        decimal ndc "DECIMAL(10,2)"
        datetime criado_em "DATETIME(3)"
    }

    treinos {
        string idTreino PK "VARCHAR(36)"
        string idCalculo FK "VARCHAR(191) NULL"
        string idUsuario FK "VARCHAR(191) NULL"
        string titulo "VARCHAR(150)"
        enum objetivo "ENUM('Hipertrofia','Emagrecimento','Resistencia','Condicionamento')"
        enum nivel "ENUM('Iniciante','Intermediario','Avancado')"
        boolean is_oficial "TINYINT(1)"
        datetime data_criacao "DATETIME(3)"
    }

    exercicios {
        string idExercicio PK "VARCHAR(36)"
        string nome "VARCHAR(150)"
        enum grupo_muscular "ENUM('Peito','Costa','Ombro','Braço','Antebraço','Coxa','Perna','Glúteos','Abdomen','Cardio')"
        string descricao "VARCHAR(255)"
        string caminho_video "VARCHAR(255)"
    }

    treinos_exercicios {
        string idTreino PK,FK "VARCHAR(191)"
        string idExercicio PK,FK "VARCHAR(191)"
        int series "INT"
        int repeticoes "INT"
        int descanso_segundos "INT"
        enum grupo_muscular "ENUM('Peito','Costa','Ombro','Braço','Antebraço','Coxa','Perna','Glúteos','Abdomen','Cardio')"
        enum tipo "ENUM('Forca','Cardio','Alongamento','Mobilidade')"
    }

    email_verification_tokens {
        string id PK "VARCHAR(36)"
        string usuarioId FK "VARCHAR(191)"
        string token_hash UK "VARCHAR(64)"
        datetime expira_em "DATETIME(3)"
        datetime usado_em "DATETIME(3)"
        datetime criado_em "DATETIME(3)"
    }

    password_reset_tokens {
        string id PK "VARCHAR(36)"
        string usuarioId FK "VARCHAR(191)"
        string token_hash UK "VARCHAR(64)"
        datetime expira_em "DATETIME(3)"
        datetime usado_em "DATETIME(3)"
        datetime criado_em "DATETIME(3)"
    }
```

---

## Descrição das Tabelas e Cardinalidades

| Tabela Origem | Cardinalidade | Tabela Destino | Chave Estrangeira | Ação On Delete / On Update |
| :--- | :---: | :--- | :--- | :--- |
| `usuarios` | **1 : 1** | `perfil` | `perfil.idUsuario` -> `usuarios.id` | CASCADE / CASCADE |
| `usuarios` | **1 : 1** | `dados_corporais` | `dados_corporais.idUsuario` -> `usuarios.id` | CASCADE / CASCADE |
| `usuarios` | **1 : N** | `email_verification_tokens` | `email_verification_tokens.usuarioId` -> `usuarios.id` | CASCADE / CASCADE |
| `usuarios` | **1 : N** | `password_reset_tokens` | `password_reset_tokens.usuarioId` -> `usuarios.id` | CASCADE / CASCADE |
| `usuarios` | **1 : N** | `treinos` | `treinos.idUsuario` -> `usuarios.id` | CASCADE / CASCADE |
| `dados_corporais` | **1 : N** | `calculos` | `calculos.idDados` -> `dados_corporais.idDados` | CASCADE / CASCADE |
| `dados_corporais` | **1 : N** | `historico_corporal` | `historico_corporal.idDados` -> `dados_corporais.idDados` | CASCADE / CASCADE |
| `calculos` | **1 : N** | `treinos` | `treinos.idCalculo` -> `calculos.idCalculo` | CASCADE / CASCADE |
| `treinos` | **1 : N** | `treinos_exercicios` | `treinos_exercicios.idTreino` -> `treinos.idTreino` | CASCADE / CASCADE |
| `exercicios` | **1 : N** | `treinos_exercicios` | `treinos_exercicios.idExercicio` -> `exercicios.idExercicio` | CASCADE / CASCADE |
