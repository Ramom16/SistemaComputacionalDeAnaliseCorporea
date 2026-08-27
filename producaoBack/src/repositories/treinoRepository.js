import prisma from "../database/prismaClient.js";

const treinoRepository = {

    async criar({ idUsuario, idCalculo, titulo, objetivo, nivel, is_oficial }) {
        return await prisma.treino.create({
            data: {
                idUsuario: idUsuario ? Number(idUsuario) : null,
                idCalculo: idCalculo ? Number(idCalculo) : null,
                titulo,
                objetivo,
                nivel,
                is_oficial: Boolean(is_oficial)
            }
        });
    },

    async buscarPorId(idTreino) {
        return await prisma.treino.findUnique({
            where: {
                idTreino: Number(idTreino)
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
                    { idUsuario: Number(idUsuario) },
                    { is_oficial: true },
                    {
                        calculo: {
                            dados: {
                                idUsuario: Number(idUsuario)
                            }
                        }
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
                idTreino: Number(idTreino)
            },
            data: dados
        });
    },

    async deletar(idTreino) {
        return await prisma.treino.delete({
            where: {
                idTreino: Number(idTreino)
            }
        });
    }
};

export default treinoRepository;