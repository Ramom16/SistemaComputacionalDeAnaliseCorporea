const EvolucaoService = {

    gerarGrafico(historico) {

        return historico.map(item => ({

            data: new Date(item.criado_em)
                .toLocaleDateString("pt-BR"),

            peso: Number(item.peso_kg),

            imc: Number(item.imc),

            tmb: Number(item.tmb),

            ndc: Number(item.ndc)

        }));

    }

};

export default EvolucaoService;