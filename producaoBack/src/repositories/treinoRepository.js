import prisma from "../database/prismaClient.js";
import DadosCorporaisRepository from "./dadosCorporaisRepository.js";

const treinoRepository = {

  criar: async (idTreino, idCalculo, objetivo, nivel, data_criacao) => {
    try {
        if (!idTreino || !idCalculo || !objetivo || !nivel || !data_criacao) {
            throw new Error("Todos os campos são obrigatórios");
        }
        const idCalculoExists = await DadosCorporaisRepository.findById(idCalculo);
        if (!idCalculoExists) {
            throw new Error("O ID do cálculo fornecido não existe");
        }

    } catch (error) {
      console.error("Erro ao criar treino:", error);
      throw new Error("Erro ao criar treino");
    }
    
    return await prisma.treino.create({
      data: {
        idTreino,
        idCalculo,
        objetivo,
        nivel,
        data_criacao
      }
    });
  },

  listar: async () => {
    return await prisma.treino.findMany({
      orderBy: {
        idTreino: "desc"
      }
    });
  },

  editar: async(idTreino, idCalculo, objetivo, nivel, data_criacao) => {
    return await prisma.treino.update({
      where: {
        idTreino: idTreino
      },
      data: {
        idCalculo,
        objetivo,
        nivel,
        data_criacao
      }
    });
  }

};

export default treinoRepository;