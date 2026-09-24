import prisma from "../database/prismaClient.js";

import DadosCorporaisRepository
    from "../repositories/dadosCorporaisRepository.js";

import CalculosService
    from "./calculosService.js";


const DadosCorporaisService = {

    async criar(dados) {

        return await prisma.$transaction(
            async (transaction) => {

                const existe =
                    await DadosCorporaisRepository
                        .findByUsuario(
                            String(dados.idUsuario),
                            transaction
                        );

                if (existe) {

                    throw new Error(
                        "Usuário já possui dados corporais"
                    );
                }

                const dadosCriados =
                    await DadosCorporaisRepository.create(
                        dados,
                        transaction
                    );

                const calculos =
                    CalculosService.gerarCalculos(
                        dadosCriados
                    );

                const calculoCriado =
                    await transaction.calculo.create({

                        data: {

                            idDados:
                                String(dadosCriados.idDados),

                            imc:
                                calculos.imc,

                            tmb:
                                calculos.tmb,

                            ndc:
                                calculos.ndc
                        }
                    });

                return {

                    dadosCorporais:
                        dadosCriados,

                    calculos: {

                        ...calculos,

                        idCalculo:
                            calculoCriado.idCalculo
                    }
                };
            }
        );
    },

    async atualizar(idUsuario, dados) {

        return await prisma.$transaction(
            async (transaction) => {

                const existe =
                    await DadosCorporaisRepository
                        .findByUsuario(
                            String(idUsuario),
                            transaction
                        );

                if (!existe) {

                    throw new Error(
                        "Dados corporais não encontrados"
                    );
                }

                const dadosAtualizados =
                    await DadosCorporaisRepository
                        .atualizarDados(
                            String(idUsuario),
                            dados,
                            transaction
                        );
                const calculos =
                    CalculosService.gerarCalculos(
                        dadosAtualizados
                    );
                const calculoCriado =
                    await transaction.calculo.create({
                        data: {

                            idDados:
                                String(dadosAtualizados.idDados),

                            imc:
                                calculos.imc,

                            tmb:
                                calculos.tmb,

                            ndc:
                                calculos.ndc
                        }
                    });

                return {
                    dadosCorporais:
                        dadosAtualizados,

                    calculos: {
                        ...calculos,
                        idCalculo:
                            calculoCriado.idCalculo
                    }
                };
            }
        );
    }
};

export default DadosCorporaisService;