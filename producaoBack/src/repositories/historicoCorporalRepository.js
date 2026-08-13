import prisma from "../database/prismaClient.js";

const HistoricoCorporalRepository = {

    buscarPorUsuario: async (idUsuario) => {

        const dados =
            await prisma.dadosCorporais.findUnique({
                where: {
                    idUsuario: Number(idUsuario)
                },
                select: {
                    idDados: true
                }
            });

        if (!dados) {
            throw new Error(
                "Dados corporais não encontrados"
            );
        }

        return await prisma.historicoCorporal.findMany({
            where: {
                idDados: dados.idDados
            },
            orderBy: {
                criado_em: "asc"
            }
        });

    }

};

export default HistoricoCorporalRepository;