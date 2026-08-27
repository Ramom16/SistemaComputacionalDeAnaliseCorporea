import prisma from "../database/prismaClient.js";
import treinoExercicioRepository from "../repositories/treinoExercicioRepository.js";

const treinoExercicioService = {

    async validarAcessoTreino(idUsuario, idTreino, leituraApenas = false) {
        const treino = await prisma.treino.findUnique({
            where: { idTreino }
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
            where: { idExercicio: dados.idExercicio }
        });

        if (!exercicio) {
            throw new Error("Exercício não encontrado.");
        }

        const existente = await treinoExercicioRepository.buscar(idTreino, dados.idExercicio);

        if (existente) {
            throw new Error("Este exercício já está associado ao treino.");
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
        await this.validarAcessoTreino(idUsuario, idTreino, true);
        return await treinoExercicioRepository.listarPorTreino(idTreino);
    },

    async remover(idUsuario, idTreino, idExercicio) {
        await this.validarAcessoTreino(idUsuario, idTreino);
        return await treinoExercicioRepository.remover(idTreino, idExercicio);
    },

    async atualizar(idUsuario, idTreino, idExercicio, dados) {
        await this.validarAcessoTreino(idUsuario, idTreino);

        const existente = await treinoExercicioRepository.buscar(idTreino, idExercicio);
        if (!existente) {
            throw new Error("Exercício não encontrado neste treino.");
        }

        return await treinoExercicioRepository.atualizar(idTreino, idExercicio, dados);
    }
};

export default treinoExercicioService;