export class DadosCorporais {

    #idUsuario;
    #peso_kg;
    #altura_cm;
    #genero;
    #idade;
    #nivel_atividade;

    constructor(
        idUsuario,
        peso_kg,
        altura_cm,
        genero,
        idade,
        nivel_atividade
    ) {

        this.idUsuario = idUsuario;
        this.peso_kg = peso_kg;
        this.altura_cm = altura_cm;
        this.genero = genero;
        this.idade = idade;
        this.nivel_atividade = nivel_atividade;
    }
    // GETTERS
    get idUsuario() {
        return this.#idUsuario;
    }
    get peso_kg() {
        return this.#peso_kg;
    }
    get altura_cm() {
        return this.#altura_cm;
    }
    get genero() {
        return this.#genero;
    }
    get idade() {
        return this.#idade;
    }
    get nivel_atividade() {
        return this.#nivel_atividade;
    }
    // SETTERS

    set idUsuario(value) {
        this.#validarIdUsuario(value);
        this.#idUsuario = value;
    }
    set peso_kg(value) {
        this.#validarPeso(value);
        this.#peso_kg = value;
    }
    set altura_cm(value) {
        this.#validarAltura(value);
        this.#altura_cm = value;
    }
    set genero(value) {
        this.#validarGenero(value);
        this.#genero = value;
    }
    set idade(value) {
        this.#validarIdade(value);
        this.#idade = value;
    }
    set nivel_atividade(value) {
        this.#validarNivelAtividade(value);
        this.#nivel_atividade = value;
    }
    // VALIDAÇÕES

    #validarIdUsuario(idUsuario) {
        if (idUsuario === undefined || typeof idUsuario !== "number") {
            throw new Error("ID do usuário inválido");
        }
    }

    #validarPeso(peso) {

        if (typeof peso !== "number" ||peso <= 0) {
            throw new Error("Peso inválido");
        }
    }

    #validarAltura(altura) {
        if (typeof altura !== "number" ||altura <= 0) {
            throw new Error("Altura inválida");
        }
    }
    #validarGenero(genero) {

        const generosValidos = [
            "Masculino",
            "Feminino",
            "Outro"
        ];

        if (!generosValidos.includes(genero)) {
            throw new Error("Gênero inválido");
        }
    }

    #validarIdade(idade) {
        if (typeof idade !== "number" ||idade <= 0) {
            throw new Error("Idade inválida");
        }
    }

    #validarNivelAtividade(nivel) {

        const niveisValidos = [
            "Sedentario",
            "Leve",
            "Moderado",
            "Intenso",
            "MuitoIntenso"
        ];

        if (!niveisValidos.includes(nivel)) {
            throw new Error("Nível de atividade inválido");
        }
    }

    // FACTORY METHODS

    static criar({
        idUsuario,
        peso_kg,
        altura_cm,
        genero,
        idade,
        nivel_atividade
    }) {

        return new DadosCorporais(
            Number(idUsuario),
            Number(peso_kg),
            Number(altura_cm),
            genero,
            Number(idade),
            nivel_atividade
        );
    }
    static editar({
        idUsuario,
        peso_kg,
        altura_cm,
        genero,
        idade,
        nivel_atividade
    }) {

        return new DadosCorporais(
            Number(idUsuario),
            Number(peso_kg),
            Number(altura_cm),
            genero,
            Number(idade),
            nivel_atividade
        );
    }
}

