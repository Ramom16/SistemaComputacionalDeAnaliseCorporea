import prisma from "../config/prisma.js";

const treinoRepository = {

    async criar({ idCalculo, objetivo, nivel }) {
        return await prisma.treino.create({
            data: {
                idCalculo,
                objetivo,
                nivel
            }
        });
    },

    async buscarPorId(idTreino) {
        return await prisma.treino.findUnique({
            where: {
                idTreino
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
                calculo: {
                    dados: {
                        idUsuario
                    }
                }
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
                idTreino
            },
            data: dados
        });
    },

    async deletar(idTreino) {
        return await prisma.treino.delete({
            where: {
                idTreino
            }
        });
    }
};

export default treinoRepository;