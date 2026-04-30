# Modelo de dados

Este documento vai apresentar o modelo de banco de dados do sistema, com foco nas entidades e seus relacionamentos

## Entidade: USUARIO

### Descrição
A entidade usuario vai representar os clientes(usuarios) do nosso sistema

### Atributos
- id_usuario (PK)
- nome
- email
- senha

## Entidade: DADOS_CORPORAIS

### Descrição
Armazenação de dados corporais do usuário, utilizando como base para os cálculos metabólicos

### Atributos
- id_dados (PK)
- peso
- altura
- idade
- nivel_atividade
- data_registro
- id_usuario (FK)

## Entidade: CALCULO

## Descrição
Armazena os resultados dos cálculos realizados com base nos dados corporais, como IMC, TMB e NDC.

### Atributos
- id_calculo (PK)
- id_dados (FK)
- imc
- tmb
- ndc
- data_calculo

## Entidade: TREINO

## Descrição
Representa os treinos gerados pelo sistema com base nos cálculos e objetivos do usuário.

### Atributos
- id_treino (PK)
- objetivo
- nivel
- data_criacao
- id_calculo

## Entidade: EXERCICIO

### Descrição
Armazena os exercícios disponíveis no sistema, incluindo informações para execução.

### Atributos
- id_exercicio (PK)
- nome
- descricao
- video

## Entidade: TREINO_EXERCICIO 

### Descrição
Tabela associativa responsável por relacionar treinos e exercícios, permitindo a criação de rotinas personalizadas.

### Atributos
- id_treino(FK)
- id_exercicio(FK)
- series
- descanso
- repeticoes
- grupo_muscular
- tipo