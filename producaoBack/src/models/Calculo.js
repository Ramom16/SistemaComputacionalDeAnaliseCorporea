export class Calculo {
    #idCalculo
    #idDados
    #imc
    #tmb
    #ndc
    #dataCalculo
    #dataAtualizacaoCalculo
    #treinos

    constructor(
        idDados,
        imc,
        tmb,
        ndc,
        treinos = [],
        idCalculo = null,
        dataCalculo = null,
        dataAtualizacaoCalculo = null
    ) {
        this.idDados = idDados;
        this.imc = imc;
        this.tmb = tmb;
        this.ndc = ndc;
        this.treinos = treinos;

        this.#idCalculo = idCalculo;
        this.#dataCalculo = dataCalculo;
        this.#dataAtualizacaoCalculo = dataAtualizacaoCalculo;
    }

    // GETTERS

    get idCalculo() {
        return this.#idCalculo;
    }

    get idDados() {
        return this.#idDados;
    }

    get imc() {
        return this.#imc;
    }

    get tmb() {
        return this.#tmb;
    }

    get ndc() {
        return this.#ndc;
    }

    get treinos() {
        return this.#treinos;
    }

    get dataCalculo() {
        return this.#dataCalculo;
    }

    get dataAtualizacaoCalculo() {
        return this.#dataAtualizacaoCalculo;
    }

    // SETTERS
    set idDados(value) {
        this.#validarIdDados(value);
        this.#idDados = value;
    }

    set imc(value) {
        this.#validarImc(value);
        this.#imc = value;
    }

    set tmb(value) {
        this.#validarTmb(value);
        this.#tmb = value;
    }

    set ndc(value) {
        this.#validarNdc(value);
        this.#ndc = value;
    }

    set treinos(value) {
        this.#validarTreinos(value);
        this.#treinos = value;
    }
    // VALIDAÇÕES
    #validarIdDados(value) {
        if (!value || typeof value !== "number") {
            throw new Error("ID dos dados corporais é obrigatório");
        }
    }

    #validarImc(value) {
        if (
            value === null ||
            value === undefined ||
            typeof value !== "number" ||
            value <= 0
        ) {
            throw new Error("IMC inválido");
        }
    }

    #validarTmb(value) {
        if (
            value === null ||
            value === undefined ||
            typeof value !== "number" ||
            value <= 0
        ) {
            throw new Error("TMB inválido");
        }
    }

    #validarNdc(value) {
        if (
            value === null ||
            value === undefined ||
            typeof value !== "number" ||
            value <= 0
        ) {
            throw new Error("NDC inválido");
        }
    }

    #validarTreinos(value) {
        if (!Array.isArray(value)) {
            throw new Error("Treinos devem ser um array");
        }
    }
    // FACTORY METHODS

    static criar({
        idDados,
        imc,
        tmb,
        ndc,
        treinos = []
    }) {
        if (
            idDados === undefined ||
            imc === undefined ||
            tmb === undefined ||
            ndc === undefined
        ) {
            console.log({
                idDados,
                imc,
                tmb,
                ndc
            });

            throw new Error("Dados obrigatórios faltando");
        }

        return new Calculo(
            idDados,
            Number(imc),
            Number(tmb),
            Number(ndc),
            treinos
        );
    }

    static editar({
        idCalculo,
        idDados,
        imc,
        tmb,
        ndc,
        treinos = [],
        dataCalculo,
        dataAtualizacaoCalculo
    }) {
        if (!idCalculo) {
            throw new Error("ID do cálculo é obrigatório");
        }

        const calculo = new Calculo(
            Number(idDados),
            Number(imc),
            Number(tmb),
            Number(ndc),
            treinos,
            Number(idCalculo),
            dataCalculo,
            dataAtualizacaoCalculo
        );

        return calculo;
    }

    
}