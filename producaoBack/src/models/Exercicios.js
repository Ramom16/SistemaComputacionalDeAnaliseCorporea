export class Exercicio {

    #idExercicio;
    #nome;
    #descricao;
    #caminho_video;

    constructor(idExercicio, nome, descricao, caminho_video) {
        this.#idExercicio = idExercicio;
        this.#nome = nome;
        this.#descricao = descricao;
        this.#caminho_video = caminho_video;
    }

    get idExercicio() {
        return this.#idExercicio;
    }

    get nome() {
        return this.#nome;
    }

    get descricao() {
        return this.#descricao;
    }

    get caminho_video() {
        return this.#caminho_video;
    }

    // SETTERS

    set idExercicio(value) {
        this.#validarId(value);
        this.#idExercicio = value;
    }

    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    set descricao(value) {
        this.#validarDescricao(value);
        this.#descricao = value;
    }

    set caminho_video(value) {
        this.#validarCaminho(value);
        this.#caminho_video = value;
    }

    // VALIDAÇÕES

    #validarId(value) {
        if (value !== null && value !== undefined && (typeof value !== "number" || value <= 0)) {
            throw new Error("ID do exercício inválido.");
        }
    }

    #validarNome(value) {
        if (!value || typeof value !== "string" || value.trim().length < 2 || value.trim().length > 150) {
            throw new Error("Nome do exercício inválido. Deve ter entre 2 e 150 caracteres.");
        }
    }

    #validarDescricao(value) {
        if (value && (typeof value !== "string" || value.trim().length > 255)) {
            throw new Error("Descrição do exercício inválida. Deve ter no máximo 255 caracteres.");
        }
    }

    #validarCaminho(value) {
        if (value && (typeof value !== "string" || value.trim().length > 255)) {
            throw new Error("Caminho de vídeo do exercício inválido.");
        }
    }

    // FACTORY METHODS

    static criar({ nome, nome_exercicio, descricao, descricao_exercicio, caminho_video }) {
        const nomeFinal = nome || nome_exercicio;
        const descricaoFinal = descricao !== undefined ? descricao : descricao_exercicio;

        if (!nomeFinal) {
            throw new Error("Nome do exercício é obrigatório.");
        }

        return new Exercicio(
            null,
            nomeFinal,
            descricaoFinal || null,
            caminho_video || null
        );
    }

    static editar({ idExercicio, id, nome, nome_exercicio, descricao, descricao_exercicio, caminho_video }) {
        const idFinal = idExercicio || id;
        const nomeFinal = nome || nome_exercicio;
        const descricaoFinal = descricao !== undefined ? descricao : descricao_exercicio;

        if (!idFinal) {
            throw new Error("ID do exercício é obrigatório.");
        }

        return new Exercicio(
            idFinal,
            nomeFinal,
            descricaoFinal || null,
            caminho_video || null
        );
    }
}