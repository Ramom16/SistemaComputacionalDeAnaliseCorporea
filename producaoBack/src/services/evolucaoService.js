const EvolucaoService = {
    gerarGrafico(historico) {

        const separarDados = (campo) => {
            return historico.map(item => ({
                data: new Date(item.criado_em)
                    .toLocaleDateString("pt-BR"),
                valor: Number(item[campo])
            }));
        };

        const calcularMedia = (campo) => {
            const soma = historico.reduce(
                (total, item) =>
                    total + Number(item[campo]),
                0
            );

            return Number(
                (soma / historico.length)
                    .toFixed(2)
            );
        };
        return {
            peso: {
                dados: separarDados("peso_kg"),
                media: calcularMedia("peso_kg")
            },
            imc: {
                dados: separarDados("imc"),
                media: calcularMedia("imc")
            },
            tmb: {
                dados: separarDados("tmb"),
                media: calcularMedia("tmb")
            },
            ndc: {
                dados: separarDados("ndc"),
                media: calcularMedia("ndc")
            }
        };
    }
};

export default EvolucaoService;