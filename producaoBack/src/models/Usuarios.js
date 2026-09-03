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
    #bloqueado_ate;
    #tentativas_login;


    constructor(
        nome,
        email,
        senha_hash,
        data_nascimento,
        ativo = true,
        email_verificado = false,
        ultimo_login = null,
        criado_em = null,
        bloqueado_ate = null,
        tentativas_login = 0,
        id = null
    ) {

        this.id = id;

        this.nome = nome;
        this.email = email;
        this.senha_hash = senha_hash;
        this.data_nascimento = data_nascimento;

        this.ativo = ativo;
        this.email_verificado = email_verificado;

        this.ultimo_login = ultimo_login;
        this.criado_em = criado_em;

        this.bloqueado_ate = bloqueado_ate;
        this.tentativas_login = tentativas_login;
    }


    // =========================
    // GETTERS
    // =========================

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

    get bloqueado_ate() {
        return this.#bloqueado_ate;
    }

    get tentativas_login() {
        return this.#tentativas_login;
    }


    // =========================
    // SETTERS
    // =========================

    set id(value) {

        if (
            value !== null &&
            value !== undefined
        ) {

            if (
                !Number.isInteger(Number(value)) ||
                Number(value) <= 0
            ) {
                throw new Error(
                    "ID do usuário inválido"
                );
            }

            this.#id = Number(value);

        } else {

            this.#id = null;
        }
    }


    set nome(value) {

        if (
            typeof value !== "string" ||
            value.trim().length < 3 ||
            value.trim().length > 250
        ) {
            throw new Error(
                "Nome deve ter entre 3 e 250 caracteres"
            );
        }

        this.#nome = value.trim();
    }


    set email(value) {

        if (
            typeof value !== "string" ||
            value.trim().length < 5 ||
            value.trim().length > 255
        ) {
            throw new Error(
                "Email inválido"
            );
        }

        const email =
            value.trim().toLowerCase();

        const regex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(email)) {

            throw new Error(
                "Email inválido"
            );
        }

        this.#email = email;
    }


    set senha_hash(value) {

        if (
            typeof value !== "string" ||
            value.length < 40 ||
            value.length > 255
        ) {
            throw new Error(
                "Hash da senha inválido"
            );
        }

        this.#senha_hash = value;
    }


    set data_nascimento(value) {

        if (!value) {

            this.#data_nascimento = null;
            return;
        }

        const data = new Date(value);

        if (isNaN(data.getTime())) {

            throw new Error(
                "Data de nascimento inválida"
            );
        }

        if (data > new Date()) {

            throw new Error(
                "Data de nascimento não pode ser futura"
            );
        }

        this.#data_nascimento = data;
    }


    set ativo(value) {

        if (typeof value !== "boolean") {

            throw new Error(
                "Ativo deve ser boolean"
            );
        }

        this.#ativo = value;
    }


    set email_verificado(value) {

        if (typeof value !== "boolean") {

            throw new Error(
                "Email_verificado deve ser boolean"
            );
        }

        this.#email_verificado = value;
    }


    set ultimo_login(value) {

        if (value === null) {

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

        if (value === null) {

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


    set bloqueado_ate(value) {

        if (value === null) {

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


    set tentativas_login(value) {

        if (
            !Number.isInteger(Number(value)) ||
            Number(value) < 0
        ) {
            throw new Error(
                "Número de tentativas inválido"
            );
        }

        this.#tentativas_login =
            Number(value);
    }


    // =========================
    // FACTORY
    // =========================

    static criar({
        nome,
        email,
        senha_hash,
        data_nascimento
    }) {

        return new Usuario(
            nome,
            email,
            senha_hash,
            data_nascimento,
            true,
            false,
            null,
            null,
            null,
            0,
            null
        );
    }


    static editar({
        nome,
        email,
        senha_hash,
        data_nascimento,
        ativo,
        email_verificado,
        ultimo_login,
        bloqueado_ate,
        tentativas_login
    }, id) {

        return new Usuario(

            nome,
            email,
            senha_hash,
            data_nascimento,

            ativo ?? true,

            email_verificado ?? false,

            ultimo_login ?? null,

            null,

            bloqueado_ate ?? null,

            tentativas_login ?? 0,

            id
        );
    }
}