import prisma from "../database/prismaClient.js";

const treinoRepository = {

    async criar({ idUsuario, idCalculo, titulo, objetivo, nivel, is_oficial }) {
        return await prisma.treino.create({
            data: {
<<<<<<< HEAD
                idUsuario: idUsuario ? Number(idUsuario) : null,
                idCalculo: idCalculo ? Number(idCalculo) : null,
                titulo,
=======
                idCalculo: String(idCalculo),
>>>>>>> producaoBack
                objetivo,
                nivel,
                is_oficial: Boolean(is_oficial)
            }
        });
    },

    async buscarPorId(idTreino) {
        return await prisma.treino.findUnique({
            where: {
<<<<<<< HEAD
                idTreino: Number(idTreino)
=======
                idTreino: String(idTreino)
>>>>>>> producaoBack
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
<<<<<<< HEAD
                OR: [
                    { idUsuario: Number(idUsuario) },
                    { is_oficial: true },
                    {
                        calculo: {
                            dados: {
                                idUsuario: Number(idUsuario)
                            }
                        }
=======
                calculo: {
                    dados: {
                        idUsuario: String(idUsuario)
>>>>>>> producaoBack
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
<<<<<<< HEAD
                idTreino: Number(idTreino)
=======
                idTreino: String(idTreino)
>>>>>>> producaoBack
            },
            data: dados
        });
    },

    async deletar(idTreino) {
        return await prisma.treino.delete({
            where: {
<<<<<<< HEAD
                idTreino: Number(idTreino)
=======
                idTreino: String(idTreino)
>>>>>>> producaoBack
            }
        });
    }
};

export default treinoRepository;