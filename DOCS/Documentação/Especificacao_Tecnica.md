# Especificação Técnica e Arquitetura

Este documento consolida os artefatos técnicos do Sistema de Análise Corporal e Metabólica, definindo a estrutura de dados, componentes do sistema, relação de funcionalidades e os padrões visuais (Design System).

## 1. Diagrama Entidade-Relacionamento (DER)

Abaixo apresentamos o modelo conceitual e lógico de dados que sustenta o sistema.

```mermaid
erDiagram
    usuarios ||--o{ dados_corporais : "possui"
    usuarios ||--o{ email_verification_tokens : "possui"
    usuarios ||--o{ usuarios_perfil : "tem"
    perfil ||--o{ usuarios_perfil : "tem"
    dados_corporais ||--o{ calculos : "gera"
    calculos ||--o{ treinos : "gera"
    treinos ||--o{ treinos_exercicios : "contem"
    exercicios ||--o{ treinos_exercicios : "fazem parte"

    usuarios {
        int id PK
        string nome
        string email
        string senha_hash
        date data_nascimento
        boolean ativo
        boolean email_verificado
        timestamp ultimo_login
        timestamp criado_em
    }

    dados_corporais {
        int idDados PK
        int idUsuario FK
        decimal peso_kg
        decimal altura_cm
        enum genero
        int idade
        enum nivel_atividade
        timestamp data_registro
    }

    calculos {
        int idCalculo PK
        int idDados FK
        decimal imc
        decimal tmb
        decimal ndc
        timestamp data_calculo
    }
    
    email_verification_tokens {
        int id PK
        string token
        int usuarioId FK
        datetime expira_em
        timestamp criado_em
    }

    exercicios {
        int idExercicio PK
        string nome
        string descricao
        string caminho_video
    }

    perfil {
        int idPerfil PK
        string nome
    }

    treinos {
        int idTreino PK
        int idCalculo FK
        enum objetivo
        enum nivel
        timestamp data_criacao
    }

    treinos_exercicios {
        int idTreino PK,FK
        int idExercicio PK,FK
        int series
        int descanso_segundos
        int repeticoes
        string grupo_muscular
        enum tipo
    }

    usuarios_perfil {
        int idUsuario PK,FK
        int idPerfil PK,FK
    }
```


## 2. Relacionamento: Funcionalidades, Dados e Lógica

A matriz abaixo detalha como os requisitos propostos se conectam à estrutura de banco e à lógica de programação.

| Funcionalidade | Tabelas/Entidades Envolvidas | Lógica de Negócio Envolvida |
| --- | --- | --- |
| **Cadastro e Login** | `usuarios`, `perfil`, `email_verification_tokens` | Hash de senhas (bcrypt), geração e validação de JWT, envio de e-mails para verificação de conta. |
| **Cálculo de IMC, TMB e NDC** | `dados_corporais`, `calculos` | Fórmulas matemáticas (ex: IMC = peso / altura²; TMB via equação de Harris-Benedict) multiplicadas pelo fator de atividade do usuário. |
| **Geração de Treinos Iniciais** | `treinos`, `treinos_exercicios`, `exercicios`, `calculos` | Algoritmo que lê o objetivo (hipertrofia, emagrecimento), nível e NDC do usuário e seleciona um subconjunto adequado de `exercicios` com séries/repetições predefinidas. |
| **Acompanhamento de Evolução** | `dados_corporais`, `calculos` | Consultas cronológicas (`ORDER BY data_registro DESC`) extraindo gráficos de evolução de Peso, IMC e NDC. |
| **Exibição de Exercícios** | `exercicios`, `treinos_exercicios` | Front-end renderiza a lista de exercícios do treino atual, carregando o campo `caminho_video` para um media player. |

