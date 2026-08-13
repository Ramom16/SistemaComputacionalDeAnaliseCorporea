export class DadosCorporais {

    #idDados;
    #idUsuario;
    #peso_kg;
    #altura_cm;
    #genero;
    #idade;
    #nivel_atividade;
    #data_registro_Inicial;
    #data_atualizacao_dados;

    constructor(
        idUsuario,
        peso_kg,
        altura_cm,
        genero,
        idade,
        nivel_atividade,
        idDados = null,
        data_registro_Inicial = null,
        data_atualizacao_dados = null
    ) {

        this.idUsuario = idUsuario;
        this.peso_kg = peso_kg;
        this.altura_cm = altura_cm;
        this.genero = genero;
        this.idade = idade;
        this.nivel_atividade = nivel_atividade;

        this.idDados = idDados;
        this.data_registro_Inicial = data_registro_Inicial;
        this.data_atualizacao_dados = data_atualizacao_dados;
    }

    // =========================
    // GETTERS
    // =========================

    get idDados() {
        return this.#idDados;
    }

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

    get data_registro_Inicial() {
        return this.#data_registro_Inicial;
    }

    get data_atualizacao_dados() {
        return this.#data_atualizacao_dados;
    }

    // =========================
    // SETTERS
    // =========================

    set idDados(value) {

        if (
            value !== null &&
            value !== undefined &&
            (!Number.isInteger(Number(value)) ||
             Number(value) <= 0)
        ) {
            throw new Error("ID dos dados corporais inválido");
        }

        this.#idDados =
            value === null || value === undefined
                ? null
                : Number(value);
    }

    set idUsuario(value) {

        if (
            !Number.isInteger(Number(value)) ||
            Number(value) <= 0
        ) {
            throw new Error("ID do usuário inválido");
        }

        this.#idUsuario = Number(value);
    }

    set peso_kg(value) {

        const peso = Number(value);

        if (
            !Number.isFinite(peso) ||
            peso <= 0 ||
            peso > 500
        ) {
            throw new Error("Peso inválido");
        }

        this.#peso_kg = peso;
    }

    set altura_cm(value) {

        const altura = Number(value);

        if (
            !Number.isFinite(altura) ||
            altura <= 0 ||
            altura > 300
        ) {
            throw new Error("Altura inválida");
        }

        this.#altura_cm = altura;
    }

    set genero(value) {

        this.#validarGenero(value);

        this.#genero = value;
    }

    set idade(value) {

        const idade = Number(value);

        if (
            !Number.isInteger(idade) ||
            idade <= 0 ||
            idade > 130
        ) {
            throw new Error("Idade inválida");
        }

        this.#idade = idade;
    }

    set nivel_atividade(value) {

        this.#validarNivelAtividade(value);

        this.#nivel_atividade = value;
    }

    set data_registro_Inicial(value) {

        if (value === null || value === undefined) {
            this.#data_registro_Inicial = null;
            return;
        }

        const data = new Date(value);

        if (isNaN(data.getTime())) {
            throw new Error("Data de registro inválida");
        }

        this.#data_registro_Inicial = data;
    }

    set data_atualizacao_dados(value) {

        if (value === null || value === undefined) {
            this.#data_atualizacao_dados = null;
            return;
        }

        const data = new Date(value);

        if (isNaN(data.getTime())) {
            throw new Error("Data de atualização inválida");
        }

        this.#data_atualizacao_dados = data;
    }

    // =========================
    // VALIDAÇÕES
    // =========================

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

    // =========================
    // FACTORY METHODS
    // =========================

    static criar({
        idUsuario,
        peso_kg,
        altura_cm,
        genero,
        idade,
        nivel_atividade
    }) {

        if (!idUsuario ||
            peso_kg === undefined ||
            altura_cm === undefined ||
            !genero ||
            idade === undefined ||
            !nivel_atividade
        ) {
            throw new Error(
                "Dados corporais obrigatórios faltando"
            );
        }

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
        idDados,
        idUsuario,
        peso_kg,
        altura_cm,
        genero,
        idade,
        nivel_atividade,
        data_registro_Inicial,
        data_atualizacao_dados
    }) {

        if (!idDados) {
            throw new Error(
                "ID dos dados corporais é obrigatório"
            );
        }

        return new DadosCorporais(
            Number(idUsuario),
            Number(peso_kg),
            Number(altura_cm),
            genero,
            Number(idade),
            nivel_atividade,
            Number(idDados),
            data_registro_Inicial,
            data_atualizacao_dados
        );
    }
}