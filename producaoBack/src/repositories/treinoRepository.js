import prisma from "../database/prismaClient.js";

const treinoRepository = {

    async criar({ idCalculo, objetivo, nivel, is_oficial, titulo, descricao, idUsuario }) {
        return await prisma.treino.create({
            data: {
                idCalculo: idCalculo ? String(idCalculo) : null,
                objetivo,
                nivel,
                is_oficial: is_oficial || false,
                titulo: titulo || "Novo Treino",
                idUsuario: idUsuario ? String(idUsuario) : null
            },
            include: {
                treinoExercicios: {
                    include: {
                        exercicio: true
                    }
                }
            }
        });
    },

    async buscarPorId(idTreino) {
        return await prisma.treino.findUnique({
            where: {
                idTreino: String(idTreino)
            },
            include: {
                calculo: {
                    include: {
                        dados: {
                            include: {
                                usuario: true
                            }
                        }
                    }
                },
                treinoExercicios: {
                    include: {
                        exercicio: true
                    }
                }
            }
        });
    },

    async listarPorUsuario(idUsuario) {
        return await prisma.treino.findMany({
            where: {
                OR: [
                    // Treinos pessoais do usuário
                    {
                        calculo: {
                            dados: {
                                idUsuario: String(idUsuario)
                            }
                        }
                    },
                    // Treinos globais (oficiais)
                    {
                        is_oficial: true
                    }
                ]
            },
            include: {
                treinoExercicios: {
                    include: {
                        exercicio: true
                    }
                },
                calculo: true
            },
            orderBy: {
                data_criacao: "desc"
            }
        });
    },

    async atualizar(idTreino, dados) {
        return await prisma.treino.update({
            where: {
                idTreino: String(idTreino)
            },
            data: dados
        });
    },

    async deletar(idTreino) {
        return await prisma.treino.delete({
            where: {
                idTreino: String(idTreino)
            }
        });
    }
};

export default treinoRepository;