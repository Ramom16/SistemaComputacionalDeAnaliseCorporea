# Arquitetura do Sistema
Este documento descreve a arquitetura utilizada no sistema, seus componentes e responsabilidades.

# Visão geral

## Descrição
O sistema foi desenvolvido seguindo uma arquitetura em camadas, separando responsabilidades entre frontend, backend e banco de dados. Essa abordagem garante melhor organização, manutenção e escalabilidade da aplicação.

## Camadas da Arquitetura

### Front-end
#### Responsabilidade
- Interface com o usuário
- Coleta de Dados (peso, altura, idade, objetivo, nivel de atividade)
- Exibição de resultados (IMC, TMB, NDC)
- Exibição de treinos e exercícios

#### Tecnologias
- HTML
- CSS
- Javascript

### Back-end
#### Responsabilidade
- Processamento
- Cálculo de IMC, TMB e NDC
- Geração de treinos personalizados
- Regras de negócio
- Exposição de API REST

#### Tecnologias
- Node.js
- Express

### Banco de Dados 
#### Responsabilidade
- Armazenamento de usuários
- Armazenanto de dados corporais
- Registro de cálculos realizados
- Armazenamento de treinos e exercicios

#### Tecnologias
- MySQL

### Estrutura do Banco
- usuario
- dados_corporais
- calculo
- treino
- treino_exercicio

## Fluxo do Sistema
Usuário → Frontend → Backend → Banco de Dados
                      ↓
                 Processamento
                      ↓
              Cálculo (IMC, TMB, NDC)
                      ↓
               Geração de Treino
                      ↓
                Retorno ao usuário