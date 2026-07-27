const EvolucaoService = {

    gerarGrafico(historico) {

        return {
            peso: historico.map(item => ({
                data: item.criado_em,
                valor: Number(item.peso_kg)
            })),

            imc: historico.map(item => ({
                data: item.criado_em,
                valor: Number(item.imc)
            })),

            tmb: historico.map(item => ({
                data: item.criado_em,
                valor: Number(item.tmb)
            })),

            ndc: historico.map(item => ({
                data: item.criado_em,
                valor: Number(item.ndc)
            }))
        };

    }

};

export default EvolucaoService;