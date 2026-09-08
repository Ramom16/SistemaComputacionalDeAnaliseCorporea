import prisma from "../database/prismaClient.js";

const HistoricoCorporalRepository = {

    buscarPorUsuario: async (idUsuario) => {

        const dados =
            await prisma.dadosCorporais.findUnique({
                where: {
                    idUsuario: String(idUsuario)
                },
                select: {
                    idDados: true
                }
            });

        if (!dados) {
            return [];
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