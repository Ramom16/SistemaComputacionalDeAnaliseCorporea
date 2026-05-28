
import prisma from "../database/prismaClient.js";

const includesPadrao = {
    usuario: true,
    calculos: {
        include: {
            treinos: true
        }
    }
};

const DadosCorporaisRepository = {

    create: async (dados, transaction = prisma) => {

        return await transaction.dadosCorporais.create({
            data: {
                idUsuario: dados.idUsuario,
                peso_kg: dados.peso_kg,
                altura_cm: dados.altura_cm,
                genero: dados.genero,
                idade: dados.idade,
                nivel_atividade: dados.nivel_atividade
            },
            include: includesPadrao
        });
    },

    findAll: async () => {

        return await prisma.dadosCorporais.findMany({
            include: includesPadrao
        });
    },

    findById: async (idDados) => {

        return await prisma.dadosCorporais.findUnique({
            where: {
                idDados: Number(idDados)
            },
            include: includesPadrao
        });
    },

    findByUsuario: async (idUsuario) => {

        return await prisma.dadosCorporais.findUnique({
            where: {
                idUsuario: Number(idUsuario)
            },
            include: includesPadrao
        });
    },

    atualizarDados: async (
        idUsuario,
        dados,
        transaction = prisma
    ) => {

        return await transaction.dadosCorporais.update({
            where: {
                idUsuario: Number(idUsuario)
            },
            data: {
                peso_kg: dados.peso_kg,
                altura_cm: dados.altura_cm,
                genero: dados.genero,
                idade: dados.idade,
                nivel_atividade: dados.nivel_atividade
            },
            include: includesPadrao
        });
    },

    delete: async (idUsuario, transaction = prisma) => {

        return await transaction.dadosCorporais.delete({
            where: {
                idUsuario: Number(idUsuario)
            }
        });
    }
};

export default DadosCorporaisRepository;

