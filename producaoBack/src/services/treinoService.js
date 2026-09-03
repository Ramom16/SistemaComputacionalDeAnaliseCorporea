import prisma from "../database/prismaClient.js";
import treinoRepository from "../repositories/treinoRepository.js";

const treinoService = {
    async criar(idUsuario, dados) {

        const { idCalculo, objetivo, nivel } = dados;

        if (!idCalculo || !objetivo || !nivel) {
            throw new Error(
                "idCalculo, objetivo e nivel são obrigatórios."
            );
        }

        // Verifica se o cálculo pertence ao usuário autenticado (proteção contra IDOR)
        const calculo = await prisma.calculo.findFirst({
            where: {
                idCalculo: String(idCalculo),
                dados: {
                    idUsuario: String(idUsuario)
                }
            }
        });

        if (!calculo) {
            throw new Error(
                "O cálculo informado não foi encontrado ou não pertence ao usuário."
            );
        }

        return await treinoRepository.criar({
            idCalculo: String(idCalculo),
            objetivo,
            nivel
        });
    },

    async listarPorUsuario(idUsuario) {
        return await treinoRepository.listarPorUsuario(
            String(idUsuario)
        );
    },

    async buscarPorId(idUsuario, idTreino) {
        const treino = await treinoRepository.buscarPorId(
            String(idTreino)
        );
        if (!treino) {
            throw new Error("Treino não encontrado.");
        }

        const donoDoTreino =
            treino.calculo?.dados?.usuario?.id === String(idUsuario);

        if (!donoDoTreino) {
            throw new Error(
                "Você não possui permissão para acessar este treino."
            );
        }
        return treino;
    },

    async atualizar(idUsuario, idTreino, dados) {
        await this.buscarPorId(idUsuario, idTreino);
        return await treinoRepository.atualizar(
            String(idTreino),
            dados
        );
    },

    async deletar(idUsuario, idTreino) {
        await this.buscarPorId(idUsuario, idTreino);
        return await treinoRepository.deletar(String(idTreino));
    }
};

export default treinoService;