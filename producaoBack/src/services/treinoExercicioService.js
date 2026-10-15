import prisma from "../database/prismaClient.js";
import treinoExercicioRepository from "../repositories/treinoExercicioRepository.js";

const treinoExercicioService = {

    async buscarTreinoPermitido(idUsuario, idTreino, role = "USER", apenasLeitura = false) {
        // Primeiro tenta encontrar o treino pertencente ao usuário via cálculo (mantém compatibilidade total)
        let treino = await prisma.treino.findFirst({
            where: {
                idTreino: String(idTreino),
                calculo: {
                    dados: {
                        idUsuario: String(idUsuario)
                    }
                }
            }
        });

        if (treino) return treino;

        // Se for ADMIN, pode acessar qualquer treino
        if (role === "ADMIN") {
            treino = await (prisma.treino.findUnique ? prisma.treino.findUnique({
                where: { idTreino: String(idTreino) }
            }) : prisma.treino.findFirst({
                where: { idTreino: String(idTreino) }
            }));
            if (treino) return treino;
        }

        // Se for apenas leitura (listar), permite se for treino oficial/global
        if (apenasLeitura) {
            treino = await prisma.treino.findFirst({
                where: {
                    idTreino: String(idTreino),
                    is_oficial: true
                }
            });
            if (treino) return treino;
        }

        // Também verifica se o treino pertence ao usuário diretamente por idUsuario
        treino = await prisma.treino.findFirst({
            where: {
                idTreino: String(idTreino),
                idUsuario: String(idUsuario)
            }
        });
        if (treino) return treino;

        throw new Error("Treino não encontrado ou não pertence ao usuário.");
    },

    async adicionar(idUsuario, idTreino, dados, role = "USER") {
        await this.buscarTreinoPermitido(idUsuario, idTreino, role, false);

        const idExercicio = dados.idExercicio || dados.id;
        if (!idExercicio) {
            throw new Error("ID do exercício é obrigatório.");
        }

        const exercicio = await prisma.exercicio.findUnique({
            where: {
                idExercicio: String(idExercicio)
            }
        });

        if (!exercicio) {
            throw new Error("Exercício não encontrado.");
        }

        const existente = await treinoExercicioRepository.buscar(
            String(idTreino),
            String(idExercicio)
        );

        if (existente) {
            throw new Error("Este exercício já está associado ao treino.");
        }

        return await treinoExercicioRepository.adicionar({
            idTreino: String(idTreino),
            idExercicio: String(idExercicio),
            series: Number(dados.series ?? dados.serie ?? 3),
            descanso_segundos: Number(dados.descanso_segundos ?? 60),
            repeticoes: Number(dados.repeticoes ?? 10),
            grupo_muscular: dados.grupo_muscular || exercicio.grupo_muscular,
            tipo: dados.tipo || "Forca"
        });
    },

    async listar(idUsuario, idTreino, role = "USER") {
        await this.buscarTreinoPermitido(idUsuario, idTreino, role, true);
        return await treinoExercicioRepository.listarPorTreino(
            String(idTreino)
        );
    },

    async remover(idUsuario, idTreino, idExercicio, role = "USER") {
        await this.buscarTreinoPermitido(idUsuario, idTreino, role, false);
        return await treinoExercicioRepository.remover(
            String(idTreino),
            String(idExercicio)
        );
    },

    async atualizar(idUsuario, idTreino, idExercicio, dados, role = "USER") {
        await this.buscarTreinoPermitido(idUsuario, idTreino, role, false);
        const existente = await treinoExercicioRepository.buscar(
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