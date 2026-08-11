import prisma from "../config/prisma.js";

const treinoExercicioRepository = {

    async adicionar({
        idTreino,
        idExercicio,
        series,
        descanso_segundos,
        repeticoes,
        grupo_muscular,
        tipo
    }) {

        return await prisma.treinoExercicio.create({
            data: {
                idTreino,
                idExercicio,
                series,
                descanso_segundos,
                repeticoes,
                grupo_muscular,
                tipo
            },
            include: {
                exercicio: true
            }
        });
    },

    async listarPorTreino(idTreino) {

        return await prisma.treinoExercicio.findMany({
            where: {
                idTreino
            },
            include: {
                exercicio: true
            }
        });
    },

    async buscar(idTreino, idExercicio) {

        return await prisma.treinoExercicio.findUnique({
            where: {
                idTreino_idExercicio: {
                    idTreino,
                    idExercicio
                }
            },
            include: {
                exercicio: true,
                treino: true
            }
        });
    },

    async atualizar(idTreino, idExercicio, dados) {

        return await prisma.treinoExercicio.update({
            where: {
                idTreino_idExercicio: {
                    idTreino,
                    idExercicio
                }
            },
            data: dados,
            include: {
                exercicio: true
            }
        });
    },

    async remover(idTreino, idExercicio) {

        return await prisma.treinoExercicio.delete({
            where: {
                idTreino_idExercicio: {
                    idTreino,
                    idExercicio
                }
            }
        });
    }
};

export default treinoExercicioRepository;