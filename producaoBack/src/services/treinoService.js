import prisma from "../database/prismaClient.js";
import treinoRepository from "../repositories/treinoRepository.js";

const treinoService = {
    async criar(idUsuario, dados, userRole = "USER") {

        const { idCalculo, objetivo, nivel, is_oficial, titulo, descricao } = dados;

        // Validar objetivo e nivel (obrigatórios)
        if (!objetivo || !nivel) {
            throw new Error(
                "objetivo e nivel são obrigatórios."
            );
        }

        // Se for treino global (oficial), apenas ADMIN pode criar
        if (is_oficial && userRole !== "ADMIN") {
            throw new Error(
                "Apenas ADMINs podem criar treinos globais."
            );
        }

        // Se for treino global, não precisa de idCalculo
        if (is_oficial) {
            return await treinoRepository.criar({
                objetivo,
                nivel,
                is_oficial: true,
                titulo: titulo || "Novo Treino Global",
                descricao: descricao || null,
                idCalculo: null,
                idUsuario: null
            });
        }

        // Se for treino pessoal, requer idCalculo
        if (!idCalculo) {
            throw new Error(
                "idCalculo é obrigatório para treinos pessoais."
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
            nivel,
            is_oficial: false,
            titulo: titulo || "Novo Treino",
            descricao: descricao || null,
            idUsuario: String(idUsuario)
        });
    },

    async listarPorUsuario(idUsuario) {
        return await treinoRepository.listarPorUsuario(
            String(idUsuario)
        );
    },

    async buscarPorId(idUsuario, idTreino, role = "USER") {
        const treino = await treinoRepository.buscarPorId(
            String(idTreino)
        );
        if (!treino) {
            throw new Error("Treino não encontrado.");
        }

        const donoDoTreino =
            treino.calculo?.dados?.usuario?.id === String(idUsuario);

        if (!donoDoTreino && role !== "ADMIN") {
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