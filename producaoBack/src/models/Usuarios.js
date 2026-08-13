export class Usuario {

    #id;
    #nome;
    #email;
    #senha_hash;
    #data_nascimento;

    #ativo;
    #email_verificado;

    #ultimo_login;
    #criado_em;

    #tentativas_login;
    #bloqueado_ate;


    constructor(
        nome,
        email,
        senha_hash,
        data_nascimento,

        ativo = true,
        email_verificado = false,

        ultimo_login = null,
        criado_em = null,

        tentativas_login = 0,
        bloqueado_ate = null,

        id = null
    ) {

        this.nome = nome;
        this.email = email;
        this.senha_hash = senha_hash;
        this.data_nascimento = data_nascimento;

        this.ativo = ativo;
        this.email_verificado = email_verificado;

        this.ultimo_login = ultimo_login;
        this.criado_em = criado_em;

        this.tentativas_login = tentativas_login;
        this.bloqueado_ate = bloqueado_ate;

        this.id = id;
    }


    // ============================================================
    // GETTERS
    // ============================================================

    get id() {
        return this.#id;
    }

    get nome() {
        return this.#nome;
    }

    get email() {
        return this.#email;
    }

    get senha_hash() {
        return this.#senha_hash;
    }

    get data_nascimento() {
        return this.#data_nascimento;
    }

    get ativo() {
        return this.#ativo;
    }

    get email_verificado() {
        return this.#email_verificado;
    }

    get ultimo_login() {
        return this.#ultimo_login;
    }

    get criado_em() {
        return this.#criado_em;
    }

    get tentativas_login() {
        return this.#tentativas_login;
    }

    get bloqueado_ate() {
        return this.#bloqueado_ate;
    }


    // ============================================================
    // SETTERS
    // ============================================================

    set nome(value) {

        this.#validarNome(value);

        this.#nome = value.trim();
    }


    set email(value) {

        this.#validarEmail(value);

        this.#email = value.trim().toLowerCase();
    }


    set senha_hash(value) {

        this.#validarSenhaHash(value);

        this.#senha_hash = value;
    }


    set data_nascimento(value) {

        this.#validarDataNascimento(value);

        this.#data_nascimento = new Date(value);
    }


    set ativo(value) {

        this.#validarAtivo(value);

        this.#ativo = value;
    }


    set email_verificado(value) {

        this.#validarEmailVerificado(value);

        this.#email_verificado = value;
    }


    set ultimo_login(value) {

        if (value === null || value === undefined) {

            this.#ultimo_login = null;

            return;
        }

        const data = new Date(value);

        if (isNaN(data.getTime())) {

            throw new Error(
                "Data do último login inválida"
            );
        }

        this.#ultimo_login = data;
    }


    set criado_em(value) {

        if (value === null || value === undefined) {

            this.#criado_em = null;

            return;
        }

        const data = new Date(value);

        if (isNaN(data.getTime())) {

            throw new Error(
                "Data de criação inválida"
            );
        }

        this.#criado_em = data;
    }


    set tentativas_login(value) {

        this.#validarTentativasLogin(value);

        this.#tentativas_login = Number(value);
    }


    set bloqueado_ate(value) {

        if (value === null || value === undefined) {

            this.#bloqueado_ate = null;

            return;
        }

        const data = new Date(value);

        if (isNaN(data.getTime())) {

            throw new Error(
                "Data de bloqueio inválida"
            );
        }

        this.#bloqueado_ate = data;
    }


    set id(value) {

        if (value !== null && value !== undefined) {

            this.#validarId(value);

            this.#id = Number(value);

        } else {

            this.#id = null;
        }
    }


    // ============================================================
    // VALIDAÇÕES
    // ============================================================

    #validarNome(value) {

        if (
            !value ||
            typeof value !== "string" ||
            value.trim().length < 3 ||
            value.trim().length > 60
        ) {

            throw new Error(
                "Nome deve ter entre 3 e 60 caracteres"
            );
        }
    }


    #validarEmail(value) {

        if (
            !value ||
            typeof value !== "string" ||
            value.trim().length < 5 ||
            value.trim().length > 120
        ) {

            throw new Error(
                "Email deve ter entre 5 e 120 caracteres"
            );
        }


        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(value.trim())) {

            throw new Error(
                "Email inválido"
            );
        }
    }


    #validarSenhaHash(value) {

        if (
            !value ||
            typeof value !== "string"
        ) {

            throw new Error(
                "Senha hash inválida"
            );
        }


        /*
         * O projeto utiliza bcrypt.
         *
         * Hashes bcrypt normalmente possuem
         * 60 caracteres.
         *
         * Mantemos uma faixa para permitir
         * outros algoritmos compatíveis.
         */

        if (
            value.length < 40 ||
            value.length > 255
        ) {

            throw new Error(
                "Senha hash deve ter entre 40 e 255 caracteres"
            );
        }
    }


    #validarDataNascimento(value) {

        if (!value) {

            throw new Error(
                "Data de nascimento é obrigatória"
            );
        }


        const data = new Date(value);


        if (isNaN(data.getTime())) {

            throw new Error(
                "Data de nascimento inválida"
            );
        }


        const hoje = new Date();


        if (data > hoje) {

            throw new Error(
                "Data de nascimento não pode ser futura"
            );
        }
    }


    #validarAtivo(value) {

        if (typeof value !== "boolean") {

            throw new Error(
                "Ativo deve ser true ou false"
            );
        }
    }


    #validarEmailVerificado(value) {

        if (typeof value !== "boolean") {

            throw new Error(
                "Email_verificado deve ser true ou false"
            );
        }
    }


    #validarTentativasLogin(value) {

        if (
            !Number.isInteger(Number(value)) ||
            Number(value) < 0
        ) {

            throw new Error(
                "Número de tentativas de login inválido"
            );
        }
    }


    #validarId(value) {

        if (
            isNaN(value) ||
            Number(value) <= 0
        ) {

            throw new Error(
                "ID inválido"
            );
        }
    }


    // ============================================================
    // FACTORY - CRIAÇÃO
    // ============================================================

    static criar({
        nome,
        email,
        senha_hash,
        data_nascimento
    }) {

        if (
            !nome ||
            !email ||
            !senha_hash ||
            !data_nascimento
        ) {

            throw new Error(
                "Dados obrigatórios faltando"
            );
        }


        return new Usuario(

            nome,
            email,
            senha_hash,
            data_nascimento,

            true,
            false,

            null,
            null,

            0,
            null,

            null
        );
    }


    // ============================================================
    // FACTORY - EDIÇÃO
    // ============================================================

    static editar({
        nome,
        email,
        senha_hash,
        data_nascimento,
        ativo,
        email_verificado,
        ultimo_login,
        criado_em,
        tentativas_login,
        bloqueado_ate
    }, id) {


        if (
            !id ||
            isNaN(id)
        ) {

            throw new Error(
                "ID é obrigatório para edição"
            );
        }


        if (
            !nome ||
            !email ||
            !data_nascimento
        ) {

            throw new Error(
                "Dados obrigatórios faltando para edição"
            );
        }


        return new Usuario(

            nome,
            email,
            senha_hash,
            data_nascimento,

            ativo ?? true,
            email_verificado ?? false,

            ultimo_login ?? null,
            criado_em ?? null,

            tentativas_login ?? 0,
            bloqueado_ate ?? null,

            id
        );
    }
}