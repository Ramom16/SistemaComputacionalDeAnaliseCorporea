export class Treino {
    #idTreino 
    #idCalculo
    #objetivo
    #nivel
    #data_criacao

    constructor(
        idTreino,
        idCalculo,
        objetivo,
        nivel,
        data_criacao
    ){
        this.idTreino = idTreino;
        this.idCalculo = idCalculo;
        this.objetivo = objetivo;
        this.nivel = nivel;
        this.data_criacao = data_criacao;
    }

    //GETTERS

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

    //SETTERS

    set idTreino(value) {
        this.#validarIdTreino(value);
        this.#idTreino = value;
    }
    set idCalculo(value) {
        this.#validarIdCalculo(value);
        this.#idCalculo = value;
    }
    set objetivo(value) {
     this.#validarObjetivo(value);
        this.#objetivo = value;
    }
    set nivel(value) {
        this.#validarNivel(value);
        this.#nivel = value;
    }
    set data_criacao(value) {
        this.#validarDataCriacao(value);
        this.#data_criacao = value;
    }

    //VALIDAÇÕES

    #validarIdTreino(value) {
        if (!value) {
            throw new Error("ID do treino é obrigatório");
        }
    }

    #validarIdCalculo(value) {
        if (!value) {
            throw new Error("ID do cálculo é obrigatório");
        }
    }

    #validarObjetivo(value) {
        if (!value) {
            throw new Error("Objetivo é obrigatório");
        }
    }

    #validarNivel(value) {
        if (!value) {
            throw new Error("Nível é obrigatório");
        }
    }

    #validarDataCriacao(value) {
        if (!value) {
            throw new Error("Data de criação é obrigatória");
        }
    }

    // FACTORY METHOD
    
    static criar({
        idTreino,
        idCalculo,
        objetivo,
        nivel,
        data_criacao
    }) {
        return new Treino(
            idTreino,
            idCalculo,
            objetivo,
            nivel,
            data_criacao
        );
    }

    static editar({
        idTreino,
        idCalculo,
        objetivo,
        nivel,
        data_criacao
    }) {
        const treino = new Treino(
            idTreino,
            idCalculo,
            objetivo,
            nivel,
            data_criacao
        );
        return treino;
    }
    
}