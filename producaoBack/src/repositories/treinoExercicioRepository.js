import prisma from "../database/prismaClient.js";

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
                idTreino: String(idTreino),
                idExercicio: String(idExercicio),
                series: Number(series),
                descanso_segundos: Number(descanso_segundos),
                repeticoes: Number(repeticoes),
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
                idTreino: String(idTreino)
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
                    idTreino: String(idTreino),
                    idExercicio: String(idExercicio)
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
                    idTreino: String(idTreino),
                    idExercicio: String(idExercicio)
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
                    idTreino: String(idTreino),
                    idExercicio: String(idExercicio)
                }
            }
        });
    }
};

export default treinoExercicioRepository;