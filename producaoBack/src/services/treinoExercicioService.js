import prisma from "../database/prismaClient.js";
import treinoExercicioRepository from "../repositories/treinoExercicioRepository.js";

const treinoExercicioService = {

    async adicionar(idUsuario, idTreino, dados) {

        const treino = await prisma.treino.findFirst({
            where: {
                idTreino: String(idTreino),
                calculo: {
                    dados: {
                        idUsuario: String(idUsuario)
                    }
                }
            }
        });

        if (!treino) {
            throw new Error("Treino não encontrado.");
        }

        const eDono = treino.idUsuario === idUsuario;

        if (leituraApenas && (eDono || treino.is_oficial)) {
            return treino;
        }

        if (!eDono) {
            throw new Error("Você não tem permissão para alterar este treino.");
        }

        return treino;
    },

    async adicionar(idUsuario, idTreino, dados) {
        await this.validarAcessoTreino(idUsuario, idTreino);

        const exercicio = await prisma.exercicio.findUnique({
            where: {
                idExercicio: String(dados.idExercicio)
            }
        });

        if (!exercicio) {
            throw new Error("Exercício não encontrado.");
        }

        const existente =
            await treinoExercicioRepository.buscar(
                String(idTreino),
                String(dados.idExercicio)
            );

        if (existente) {
            throw new Error("Este exercício já está associado ao treino.");
        }

        return await treinoExercicioRepository.adicionar({
            idTreino: String(idTreino),
            idExercicio: String(dados.idExercicio),
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
                idTreino: String(idTreino),
                calculo: {
                    dados: {
                        idUsuario: String(idUsuario)
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
            String(idTreino)
        );
    },

    async remover(idUsuario, idTreino, idExercicio) {
        const treino = await prisma.treino.findFirst({
            where: {
                idTreino: String(idTreino),
                calculo: {
                    dados: {
                        idUsuario: String(idUsuario)
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
            String(idTreino),
            String(idExercicio)
        );
    },

    async atualizar(idUsuario, idTreino, idExercicio, dados) {
        const treino = await prisma.treino.findFirst({
            where: {
                idTreino: String(idTreino),
                calculo: {
                    dados: {
                        idUsuario: String(idUsuario)
                    }
                }
            }
        });
        if (!treino) {
            throw new Error(
                "Treino não encontrado ou não pertence ao usuário."
            );
        }
        const existente =
            await treinoExercicioRepository.buscar(
                String(idTreino),
                String(idExercicio)
            );
        if (!existente) {
            throw new Error("Exercício não encontrado neste treino.");
        }
        return await treinoExercicioRepository.atualizar(
            String(idTreino),
            String(idExercicio),
            dados
        );
    }
};

export default treinoExercicioService;