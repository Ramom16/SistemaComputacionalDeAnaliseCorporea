import prisma from "../database/prismaClient.js";

const exerciciosRepositories ={

    createExercicio: async (exercicio) => {

        if (!exercicio.nome || !exercicio.descricao || !exercicio.tipo || !exercicio.dificuldade) {
            throw new Error("Todos os campos são obrigatórios");
        }

        return await prisma.exercicios.create({
            data: exercicio
        });
    },
    getExercicios: async () => {
        return await prisma.exercicios.findMany();
    },

    updateExercicio: async (id, exercicio) => {
        if (!exercicio.nome || !exercicio.descricao || !exercicio.tipo || !exercicio.dificuldade) {
            throw new Error("Todos os campos são obrigatórios");
        }
        if (!id) {
            throw new Error("ID do exercício é obrigatório");
        }
        return await prisma.exercicios.update({
            where: { id: id },
            data: exercicio
        });
    },

    deleteExercicio: async (id) => {
        if (!id) {
            throw new Error("ID do exercício é obrigatório");
        }
        return await prisma.exercicios.delete({
            where: { id: id }
        });
    }

}