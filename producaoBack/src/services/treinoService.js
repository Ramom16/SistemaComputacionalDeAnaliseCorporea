//Aqui tem um detalhe: como usei prisma diretamente para validar o cálculo, o arquivo precisa importar:
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

        // Verifica se o cálculo pertence ao usuário
        const calculo = await prisma.calculo.findFirst({
            where: {
                idCalculo,
                dados: {
                    idUsuario
                }
            }
    });
        if (!calculo) {
            throw new Error(
                "O cálculo informado não pertence ao usuário."
            );
        }
        return await treinoRepository.criar({
            idCalculo,
            objetivo,
            nivel
        });
    },
    async listarPorUsuario(idUsuario) {
        return await treinoRepository.listarPorUsuario(
            idUsuario
        );
    },
    async buscarPorId(idUsuario, idTreino) {
        const treino = await treinoRepository.buscarPorId(
            idTreino
        );
        if (!treino) {
            throw new Error("Treino não encontrado.");
        }
        const donoDoTreino =
            treino.calculo.dados.usuario.id === idUsuario;
        if (!donoDoTreino) {
            throw new Error(
                "Você não possui acesso a este treino."
            );
        }
        return treino;
    },
    async atualizar(idUsuario, idTreino, dados) {
        await this.buscarPorId(idUsuario, idTreino);
        return await treinoRepository.atualizar(
            idTreino,
            dados
        );
    },
    async deletar(idUsuario, idTreino) {
        await this.buscarPorId(idUsuario, idTreino);
        return await treinoRepository.deletar(idTreino);
    }
};

export default treinoService;