// 1. Importa a instância do Prisma que você já configurou no seu projeto.
// Isso é como chamar o "garçom" para que possamos interagir com ele.
import prisma from "./src/database/prismaClient.js";

// 2. Object.keys(prisma) pega todas as propriedades/tabelas que o Prisma conhece.
// O .filter() remove da lista as propriedades que começam com "_" (pois são comandos internos do Prisma).
// O console.log() exibe o resultado dessa lista no terminal.
// O objetivo principal aqui era ver se "historicoCorporal" estava nessa lista.
console.log(Object.keys(prisma).filter(k => !k.startsWith('_')));

// 3. O typeof verifica qual é o tipo de um dado.
// Aqui estamos perguntando: "qual é o tipo da propriedade dadosCorporais dentro do Prisma?".
// Se ela existir, o console vai exibir "object".
// Se ela NÃO existir, vai exibir "undefined" (que era o que estava acontecendo com historicoCorporal).
console.log(typeof prisma.dadosCorporais);
