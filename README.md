# IRONFIT — Sistema de Análise Corporal e Gestão de Treinos

Bem-vindo ao **IRONFIT**.  
Este repositório contém a documentação e implementação de uma plataforma voltada para academias, personal trainers e alunos, com foco em análise física, métricas metabólicas e gestão inteligente de treinos.

---

## 🎯 Objetivo

Desenvolver uma solução web e mobile completa capaz de realizar:

* **Cálculos metabólicos automáticos:** IMC (Índice de Massa Corporal), TMB (Taxa Metabólica Basal) e NDC (Necessidade Diária de Calorias).
* **Gestão multi-perfil de treinos (RBAC):** Permissões diferenciadas para Alunos (`USER`) e Professores/Instrutores (`ADMIN`).
* **Fichas Oficiais e Personalizadas:** Suporte a treinos padrão montados pela academia e rotinas personalizadas criadas pelos próprios alunos.
* **Catálogo de Exercícios Enriquecido:** Mapeamento de exercícios com categorização por grupo muscular e links em vídeo.
* **Acompanhamento de Evolução:** Histórico completo de métricas corporais.

---

## 🛠️ Tecnologias Utilizadas

### Back-end
* **Runtime:** Node.js
* **Framework:** Express.js
* **ORM:** Prisma ORM
* **Autenticação:** JWT (JSON Web Tokens) com controle de acesso por Roles (`ADMIN` | `USER`)

### Banco de Dados
* **SGBD:** MySQL

### Front-end (Web) & Mobile
* **Web:** HTML5, CSS3, JavaScript
* **Mobile:** React Native

### Cloud & Deploy
* **Hospedagem:** Vercel / Render / AWS

---

## 🔐 Controle de Acesso e Permissões (RBAC)

O sistema conta com dois perfis de acesso integrados:

| Perfil | Descrição | Permissões Principais |
| :--- | :--- | :--- |
| **`ADMIN`** | Professores e Gestores | Cadastrar/editar exercícios, criar treinos oficiais da academia, gerenciar todos os treinos do sistema. |
| **`USER`** | Alunos | Registrar dados corporais, visualizar treinos oficiais, criar e gerenciar os próprios treinos pessoais. |

---

## 📄 Documentação Técnica

Para detalhes de arquitetura, diagrama de classes e rotas:

* **[Especificação Técnica e Arquitetura](./DOCS/Documentação/Especificacao_Tecnica.md):** Contém o Diagrama Entidade-Relacionamento (DER), Schema Prisma e padrões da API.
* **Matriz de Permissões (API):** Proteção das rotas com retornos `403 Forbidden` para tentativas de ações não autorizadas por usuários de nível `USER`.

---

## 🚀 Funcionalidades

- [x] Autenticação segura via JWT com suporte a `role` (`ADMIN` / `USER`).
- [x] Cálculo automático de IMC, TMB e NDC integrado ao perfil do aluno.
- [x] Catálogo de exercícios categorizados por `grupo_muscular`.
- [x] Montagem de treinos oficiais (Academia) e treinos pessoais (Aluno).
- [x] Vinculação de séries, repetições, carga e tempo de descanso por exercício.
- [x] Histórico e acompanhamento de evolução corporal ao longo do tempo.

---

## 👥 Equipe

* **Scrum Master:** Ramom Vinycius Ferreira  
* **Back-End:** Davi Custódio da Silva  
* **Front-End:** Enthony / Ramom  
* **Mobile:** Tiago Esdras da Silva Pereira  
* **Database:** Davi Custódio da Silva  
* **QA:** André Fernandes  

---

## 📌 Status do Projeto

Em desenvolvimento ativo (2026).