const CalculosService = {

    gerarCalculos: (dados) => {

        const peso = Number(dados.peso_kg);
        const altura = Number(dados.altura_cm);
        const idade = Number(dados.idade);

        const imc = calcularIMC(
            peso,
            altura
        );

        const tmb = calcularTMB(
            peso,
            altura,
            idade,
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
                CalculosService.calcularAguaDiaria(peso),

            macros:
                CalculosService.calcularMacros(ndc)
        };
    },

    classificarIMC: (imc) => {

        if (imc < 18.5)
            return "Abaixo do peso";

        if (imc < 25)
            return "Peso normal";

        if (imc < 30)
            return "Sobrepeso";

        if (imc < 35)
            return "Obesidade grau 1";

        if (imc < 40)
            return "Obesidade grau 2";

        return "Obesidade grau 3";
    },

    calcularAguaDiaria: (peso) => {

        return Number(
            ((peso * 35) / 1000).toFixed(2)
        );
    },

    calcularMacros: (ndc) => {

        return {

            proteina_g:
                Number(
                    ((ndc * 0.30) / 4)
                        .toFixed(2)
                ),

            carboidrato_g:
                Number(
                    ((ndc * 0.40) / 4)
                        .toFixed(2)
                ),

            gordura_g:
                Number(
                    ((ndc * 0.30) / 9)
                        .toFixed(2)
                )
        };
    }
};

export default CalculosService;