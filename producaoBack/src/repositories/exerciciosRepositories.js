import prisma from "../database/prismaClient.js";

const exerciciosRepository = {

    async criar({ nome, descricao, caminho_video }) {
        return await prisma.exercicio.create({
            data: {
                nome,
                descricao,
                caminho_video
            }
        });
    },

    async buscarPorId(idExercicio) {
        return await prisma.exercicio.findUnique({
            where: {
                idExercicio: Number(idExercicio)
            }
        });
    },

    async listar() {
        return await prisma.exercicio.findMany({
            orderBy: {
                nome: "asc"
            }
        });
    },

    async atualizar(idExercicio, dados) {
        return await prisma.exercicio.update({
            where: {
                idExercicio: Number(idExercicio)
            },
            data: dados
        });
    },

    async deletar(idExercicio) {
        return await prisma.exercicio.delete({
            where: {
                idExercicio: Number(idExercicio)
            }
        });
    },

    // Alias de retrocompatibilidade
    createExercicio: async function (exercicio) {
        return this.criar(exercicio);
    },
    getExercicios: async function () {
        return this.listar();
    },
    updateExercicio: async function (id, exercicio) {
        return this.atualizar(id, exercicio);
    },
    deleteExercicio: async function (id) {
        return this.deletar(id);
    }
};

export default exerciciosRepository;