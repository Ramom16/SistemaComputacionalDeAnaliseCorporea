import prisma from "../database/prismaClient.js";

import DadosCorporaisRepository
from "../repositories/dadosCorporaisRepository.js";

import CalculosService
from "./calculosService.js";

const DadosCorporaisService = {
    criar: async (dados) => {
        return await prisma.$transaction(async (transaction) => {
            const existe =
                await DadosCorporaisRepository.findByUsuario(
                    dados.idUsuario
                );
            if (existe) {
                throw new Error(
                    "Usuário já possui dados corporais"
                );
            }
            // cria dados corporais
            const dadosCriados =
                await DadosCorporaisRepository.create(
                    dados,
                    transaction
                );
            // cria cálculos automáticos
            const calculos =
                 CalculosService.gerarCalculos(
                    dadosCriados,
                    transaction
                );
            return {
                dadosCorporais: dadosCriados,
                calculos
            };
        });
    },
    atualizar: async (
        idUsuario,
        dados
    ) => {
        return await prisma.$transaction(async (transaction) => {
            const existe =
                await DadosCorporaisRepository.findByUsuario(
                    idUsuario
                );
            if (!existe) {
                throw new Error(
                    "Dados corporais não encontrados"
                );
            }
            // atualiza dados
            const dadosAtualizados =
                await DadosCorporaisRepository.atualizarDados(
                    idUsuario,
                    dados,
                    transaction
                );
            // recalcula tudo
            const calculos =
                CalculosService.gerarCalculos(
                    dadosAtualizados
                );
            return {
                dadosCorporais: dadosAtualizados,
                calculos
            };
        });
    }
};

export default DadosCorporaisService;

