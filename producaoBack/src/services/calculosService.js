import prisma from "../database/prismaClient.js";

import {
    calcularIMC,
    calcularTMB,
    calcularNDC
} from "../utils/calculosFisicos.js";

const CalculosService = {

    criarCalculo: async (dadosCorporais) => {

        const imc = calcularIMC(
            dadosCorporais.peso_kg,
            dadosCorporais.altura_cm
        );

        const classificacaoIMC =
            CalculosService.classificarIMC(imc);

        const tmb = calcularTMB(
            dadosCorporais.peso_kg,
            dadosCorporais.altura_cm,
            dadosCorporais.idade,
            dadosCorporais.genero
        );

        const ndc = calcularNDC(
            tmb,
            dadosCorporais.nivel_atividade
        );

        const aguaDiaria =
            CalculosService.calcularAguaDiaria(
                dadosCorporais.peso_kg
            );

        const macros =
            CalculosService.calcularMacros(ndc);

        const calculo =
            await prisma.calculo.create({
                data: {
                    idDados: dadosCorporais.idDados,
                    imc,
                    tmb,
                    ndc
                }
            });

        return {
            calculo,
            resumo: {
                imc,
                classificacaoIMC,
                tmb,
                ndc,
                aguaDiaria,
                macros
            }
        };
    },

    // CLASSIFICAÇÃO IMC
    classificarIMC: (imc) => {

        if (imc < 18.5) {
            return "Abaixo do peso";
        }

        if (imc < 25) {
            return "Peso normal";
        }

        if (imc < 30) {
            return "Sobrepeso";
        }

        if (imc < 35) {
            return "Obesidade grau 1";
        }

        if (imc < 40) {
            return "Obesidade grau 2";
        }

        return "Obesidade grau 3";
    },

    // ÁGUA DIÁRIA
    calcularAguaDiaria: (peso) => {

        return Number(
            ((peso * 35) / 1000).toFixed(2)
        );
    },

    // MACROS
    calcularMacros: (ndc) => {

        const proteina =
            Number(((ndc * 0.30) / 4).toFixed(2));

        const carboidrato =
            Number(((ndc * 0.40) / 4).toFixed(2));

        const gordura =
            Number(((ndc * 0.30) / 9).toFixed(2));

        return {
            proteina_g: proteina,
            carboidrato_g: carboidrato,
            gordura_g: gordura
        };
    }
};

export default CalculosService;