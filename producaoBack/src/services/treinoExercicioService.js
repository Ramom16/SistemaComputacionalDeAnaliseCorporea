import prisma from "../database/prismaClient.js";
import treinoExercicioRepository
    from "../repositories/treinoExercicioRepository.js";

const treinoExercicioService = {

    async adicionar(idUsuario, idTreino, dados) {

        const treino = await prisma.treino.findFirst({
            where: {
                idTreino,
                calculo: {
                    dados: {
                        idUsuario
                    }
                }
            }
        });

        if (!treino) {
            throw new Error(
                "Treino não encontrado ou não pertence ao usuário."
            );
        }

        const exercicio = await prisma.exercicio.findUnique({
            where: {
                idExercicio: dados.idExercicio
            }
        });

        if (!exercicio) {
            throw new Error(
                "Exercício não encontrado."
            );
        }

        const existente =
            await treinoExercicioRepository.buscar(
                idTreino,
                dados.idExercicio
            );

        if (existente) {
            throw new Error(
                "Este exercício já está associado ao treino."
            );
        }

        return await treinoExercicioRepository.adicionar({
            idTreino,
            idExercicio: dados.idExercicio,
            series: dados.series,
            descanso_segundos: dados.descanso_segundos,
            repeticoes: dados.repeticoes,
            grupo_muscular: dados.grupo_muscular,
            tipo: dados.tipo
        });
    },

    async listar(idUsuario, idTreino) {

        const treino = await prisma.treino.findFirst({
            where: {
                idTreino,
                calculo: {
                    dados: {
                        idUsuario
                    }
                }
            }
        });

        if (!treino) {
            throw new Error(
                "Treino não encontrado ou não pertence ao usuário."
            );
        }
        return await treinoExercicioRepository.listarPorTreino(
            idTreino
        );
    },
    async remover(idUsuario, idTreino, idExercicio) {
        const treino = await prisma.treino.findFirst({
            where: {
                idTreino,
                calculo: {
                    dados: {
                        idUsuario
                    }
                }
            }
        });
        if (!treino) {
            throw new Error(
                "Treino não encontrado ou não pertence ao usuário."
            );
        }
        return await treinoExercicioRepository.remover(
            idTreino,
            idExercicio
        );
    }
};

export default treinoExercicioService;