export class Treino {

    #idTreino;
    #idCalculo;
    #objetivo;
    #nivel;
    #data_criacao;

    constructor(
        idCalculo,
        objetivo,
        nivel,
        idTreino = null,
        data_criacao = null
    ) {

        this.idTreino = idTreino;
        this.idCalculo = idCalculo;
        this.objetivo = objetivo;
        this.nivel = nivel;
        this.data_criacao = data_criacao;
    }

    // =========================
    // GETTERS
    // =========================

    get idTreino() {
        return this.#idTreino;
    }

    get idCalculo() {
        return this.#idCalculo;
    }

    get objetivo() {
        return this.#objetivo;
    }

    get nivel() {
        return this.#nivel;
    }

    get data_criacao() {
        return this.#data_criacao;
    }

    // =========================
    // SETTERS
    // =========================

    set idTreino(value) {

        if (
            value !== null &&
            value !== undefined &&
            (!Number.isInteger(Number(value)) ||
             Number(value) <= 0)
        ) {
            throw new Error(
                "ID do treino inválido"
            );
        }

        this.#idTreino =
            value === null || value === undefined
                ? null
                : Number(value);
    }

    set idCalculo(value) {

        if (
            !Number.isInteger(Number(value)) ||
            Number(value) <= 0
        ) {
            throw new Error(
                "ID do cálculo inválido"
            );
        }

        this.#idCalculo = Number(value);
    }

    set objetivo(value) {

        const objetivosValidos = [
            "Hipertrofia",
            "Emagrecimento",
            "Resistencia",
            "Condicionamento"
        ];

        if (!objetivosValidos.includes(value)) {
            throw new Error(
                "Objetivo de treino inválido"
            );
        }

        this.#objetivo = value;
    }

    set nivel(value) {

        const niveisValidos = [
            "Iniciante",
            "Intermediario",
            "Avancado"
        ];

        if (!niveisValidos.includes(value)) {
            throw new Error(
                "Nível de treino inválido"
            );
        }

        this.#nivel = value;
    }

    set data_criacao(value) {

        if (
            value === null ||
            value === undefined
        ) {
            this.#data_criacao = null;
            return;
        }

        const data = new Date(value);

        if (isNaN(data.getTime())) {
            throw new Error(
                "Data de criação inválida"
            );
        }

        this.#data_criacao = data;
    }

    // =========================
    // FACTORY
    // =========================

    static criar({
        idCalculo,
        objetivo,
        nivel
    }) {

        if (
            idCalculo === undefined ||
            !objetivo ||
            !nivel
        ) {
            throw new Error(
                "Dados obrigatórios do treino faltando"
            );
        }

        return new Treino(
            Number(idCalculo),
            objetivo,
            nivel
        );
    }

    static editar({
        idTreino,
        idCalculo,
        objetivo,
        nivel,
        data_criacao
    }) {

        if (!idTreino) {
            throw new Error(
                "ID do treino é obrigatório"
            );
        }

        return new Treino(
            Number(idCalculo),
            objetivo,
            nivel,
            Number(idTreino),
            data_criacao
        );
    }
}