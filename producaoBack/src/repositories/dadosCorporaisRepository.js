import prisma from "../database/prismaClient.js";

const DadosCorporaisRepository = {

    // CREATE
    create: async (dados) => {
        return await prisma.dadosCorporais.create({
            data: {
                idUsuario: dados.idUsuario,
                peso_kg: dados.peso_kg,
                altura_cm: dados.altura_cm,
                genero: dados.genero,
                idade: dados.idade,
                nivel_atividade: dados.nivel_atividade,
            }
        });
    },

    // READ - Buscar todos
    findAll: async () => {
        return await prisma.dadosCorporais.findMany({
            include: {
                usuario: true,
                calculos: true
            }
        });
    },

    // READ - Buscar por ID dos dados
    findById: async (idDados) => {
        return await prisma.dadosCorporais.findUnique({
            where: {
                idDados: idDados
            },
            include: {
                usuario: true,
                calculos: true
            }
        });
    },

    // READ - Buscar por usuário
    findByUsuario: async (idUsuario) => {
        return await prisma.dadosCorporais.findUnique({
            where: {
                idUsuario: idUsuario
            },
            include: {
                usuario: true,
                calculos: true
            }
        });
    },

    // UPDATE
    atualizarDados: async (idUsuario, dados) => {
        return await prisma.dadosCorporais.update({
            where: {
                idUsuario: idUsuario
            },
            data: {
                peso_kg: dados.peso_kg,
                altura_cm: dados.altura_cm,
                genero: dados.genero,
                idade: dados.idade,
                nivel_atividade: dados.nivel_atividade,
            }
        });
    },

    // DELETE
    delete: async (idUsuario) => {
        return await prisma.dadosCorporais.delete({
            where: {
                idUsuario: idUsuario
            }
        });
    }

};

export default DadosCorporaisRepository;