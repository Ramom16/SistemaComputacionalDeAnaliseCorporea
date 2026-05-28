import {
    calcularIMC,
    calcularTMB,
    calcularNDC
}
from "../utils/calculosFisicos.js";

const CalculosService = {

    gerarCalculos: (dados) => {
        const imc = calcularIMC(
            Number(dados.peso_kg),
            Number(dados.altura_cm)
        );
        const tmb = calcularTMB(
            Number(dados.peso_kg),
            Number(dados.altura_cm),
            Number(dados.idade),
            dados.genero
        );
        const ndc = calcularNDC(
            tmb,
            dados.nivel_atividade
        );
        return {
            imc,
            tmb,
            ndc,
            classificacao_imc:
                CalculosService.classificarIMC(imc),
            agua_diaria_litros:
                CalculosService.calcularAguaDiaria(
                    Number(dados.peso_kg)
                ),
            macros:
                CalculosService.calcularMacros(ndc)
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
            Number(
                ((ndc * 0.30) / 4)
                .toFixed(2)
            );
        const carboidrato =
            Number(
                ((ndc * 0.40) / 4)
                .toFixed(2)
            );
        const gordura =
            Number(
                ((ndc * 0.30) / 9)
                .toFixed(2)
            );
        return {
            proteina_g: proteina,
            carboidrato_g: carboidrato,
            gordura_g: gordura
        };
    }
};
export default CalculosService;

