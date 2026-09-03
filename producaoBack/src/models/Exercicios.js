export class Exercicio {

    #idExercicio;
    #nome;
    #descricao;
    #caminho_video;

    constructor(
        nome,
        descricao = null,
        caminho_video = null,
        idExercicio = null
    ) {

        this.idExercicio = idExercicio;
        this.nome = nome;
        this.descricao = descricao;
        this.caminho_video = caminho_video;
    }

    // =========================
    // GETTERS
    // =========================

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

    // =========================
    // SETTERS
    // =========================

    set idExercicio(value) {

        if (
            value !== null &&
            value !== undefined &&
            (!Number.isInteger(Number(value)) ||
             Number(value) <= 0)
        ) {
            throw new Error(
                "ID do exercício inválido"
            );
        }

        this.#idExercicio =
            value === null || value === undefined
                ? null
                : Number(value);
    }

    set nome(value) {

        if (
            typeof value !== "string" ||
            value.trim().length < 2 ||
            value.trim().length > 150
        ) {
            throw new Error(
                "Nome do exercício deve ter entre 2 e 150 caracteres"
            );
        }

        this.#nome = value.trim();
    }

    set descricao(value) {

        if (
            value !== null &&
            value !== undefined &&
            (
                typeof value !== "string" ||
                value.trim().length > 255
            )
        ) {
            throw new Error(
                "Descrição do exercício inválida"
            );
        }

        this.#descricao =
            value === null || value === undefined
                ? null
                : value.trim();
    }

    set caminho_video(value) {

        if (
            value !== null &&
            value !== undefined &&
            (
                typeof value !== "string" ||
                value.trim().length > 255
            )
        ) {
            throw new Error(
                "Caminho do vídeo inválido"
            );
        }

        this.#caminho_video =
            value === null || value === undefined
                ? null
                : value.trim();
    }

    // =========================
    // FACTORY
    // =========================

    static criar({
        nome,
        descricao = null,
        caminho_video = null
    }) {

        return new Exercicio(
            nome,
            descricao,
            caminho_video
        );
    }

    static editar({
        idExercicio,
        nome,
        descricao = null,
        caminho_video = null
    }) {

        if (!idExercicio) {
            throw new Error(
                "ID do exercício é obrigatório"
            );
        }

        return new Exercicio(
            nome,
            descricao,
            caminho_video,
            Number(idExercicio)
        );
    }
}