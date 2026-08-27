import prisma from "../database/prismaClient.js";
import treinoRepository from "../repositories/treinoRepository.js";

const treinoService = {
    async criar(idUsuario, dados) {
        const { idCalculo, objetivo, nivel, titulo, is_oficial } = dados;

        if (!objetivo || !nivel) {
            throw new Error("Objetivo e nível são obrigatórios.");
        }

        // Se informou cálculo, valida se pertence ao usuário
        if (idCalculo) {
            const calculo = await prisma.calculo.findFirst({
                where: {
                    idCalculo: Number(idCalculo),
                    dados: { idUsuario }
                }
            });

            if (!calculo) {
                throw new Error("O cálculo informado não pertence ao usuário.");
            }
        }

        return await treinoRepository.criar({
            idUsuario,
            idCalculo: idCalculo ? Number(idCalculo) : null,
            titulo: titulo || "Novo Treino",
            objetivo,
            nivel,
            is_oficial: Boolean(is_oficial)
        });
    },

    async listarPorUsuario(idUsuario) {
        return await treinoRepository.listarPorUsuario(idUsuario);
    },

    async buscarPorId(idUsuario, idTreino) {
        const treino = await treinoRepository.buscarPorId(idTreino);

        if (!treino) {
            throw new Error("Treino não encontrado.");
        }

        const donoDoTreino = treino.idUsuario === idUsuario || treino.calculo?.dados?.idUsuario === idUsuario;
        const eOficial = treino.is_oficial;

        if (!donoDoTreino && !eOficial) {
            throw new Error("Você não possui acesso a este treino.");
        }

        return treino;
    },

    async atualizar(idUsuario, idTreino, dados) {
        await this.buscarPorId(idUsuario, idTreino);
        return await treinoRepository.atualizar(idTreino, dados);
    },

    async deletar(idUsuario, idTreino) {
        await this.buscarPorId(idUsuario, idTreino);
        return await treinoRepository.deletar(idTreino);
    }
};

export default treinoService;