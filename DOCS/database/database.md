# Modelo de dados

Este documento vai apresentar o modelo de banco de dados do sistema, com foco nas entidades e seus relacionamentos

## Entidade: USUARIOS
### Descrição
A entidade usuarios representa as pessoas que utilizam o sistema, armazenando suas informações de acesso e identificação

### Atributos
- idUsuario (PK)
- nome (NOT NULL)
- email (NOT NULL)
- senha_hash (NOT NULL)
- data_cadastro
- ativo
- email_verificado
- ultimo_login
- criado_em


## Entidade: PERFIL
### Descrição
Define os tipos de perfil do sistema, como administrador ou usuário comum

### Atributos
- idPerfil (PK)
- nome


## Entidade: USUARIOS_PERFIL
### Descrição
Tabela associativa responsável por relacionar usuários aos seus perfis

### Atributos
- idUsuario (PK, FK)
- idPerfil (PK, FK)


## Entidade: DADOS_CORPORAIS
### Descrição
Armazena os dados físicos do usuário, utilizados como base para os cálculos metabólicos

### Atributos
- idDados (PK)
- idUsuario (FK)
- peso (NOT NULL)
- altura (NOT NULL)
- genero
- idade
- nivel_atividade
- data_registro


## Entidade: CALCULOS
### Descrição
Armazena os resultados dos cálculos realizados com base nos dados corporais, como IMC, TMB e NDC

### Atributos
- idCalculo (PK)
- idDados (FK)
- imc
- tmb
- ndc
- data_calculo


## Entidade: TREINOS
### Descrição

Representa os treinos gerados pelo sistema com base nos cálculos e objetivos do usuário

### Atributos
- idTreino (PK)
- idCalculo (FK)
- objetivo
- nivel
- dataCriacao


## Entidade: EXERCICIOS
### Descrição
Armazena os exercícios disponíveis no sistema, incluindo informações para execução

### Atributos
- idExercicio (PK)
- nome
- descricao
- caminho_video


## Entidade: TREINOS_EXERCICIOS
### Descrição
Tabela associativa responsável por relacionar treinos e exercícios, permitindo a criação de rotinas personalizadas

### Atributos
- idTreino (PK, FK)
- idExercicio (PK, FK)
- series
- repeticoes
- descanso_segundos
- grupo_muscular
- tipo
### Relacionamentos
Um usuario pode possuir vários dados corporais
Um usuario pode possuir múltiplos perfis
Dados corporais geram cálculos
Um cálculo pode gerar treinos
Um treino contém vários exercícios
Um exercício pode estar em vários treinos
### Observações
A relação entre usuarios e perfis é muitos-para-muitos, resolvida por usuarios_perfil
A relação entre treinos e exercícios é muitos-para-muitos, resolvida por treinos_exercicios
O sistema utiliza dados corporais como base para cálculos metabólicos
A modelagem foi feita para evitar redundância e garantir flexibilidade