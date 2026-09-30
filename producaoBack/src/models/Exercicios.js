import { validarUUID } from "../utils/cryptoUtils.js";

const GRUPOS_MUSCULARES_VALIDOS = [
    "Peito",
    "Costa",
    "Ombro",
    "Braço",
    "Antebraço",
    "Coxa",
    "Perna",
    "Glúteos",
    "Abdomen",
    "Cardio"
];

export class Exercicio {

    #idExercicio;
    #nome;
    #grupo_muscular;
    #descricao;
    #caminho_video;

    constructor(
        nome,
        grupo_muscular,
        descricao = null,
        caminho_video = null,
        idExercicio = null
    ) {
        this.idExercicio = idExercicio;
        this.nome = nome;
        this.grupo_muscular = grupo_muscular;
        this.descricao = descricao;
        this.caminho_video = caminho_video;
    }

    // =========================
    // GETTERS (Acesso aos valores)
    // =========================

    get idExercicio() {
        return this.#idExercicio;
    }

    get nome() {
        return this.#nome;
    }

    get grupo_muscular() {
        return this.#grupo_muscular;
    }

    get descricao() {
        return this.#descricao;
    }

    get caminho_video() {
        return this.#caminho_video;
    }

    // =========================
    // SETTERS (Validações e Atribuições)
    // =========================

    set idExercicio(value) {
        if (value !== null && value !== undefined) {
            if (typeof value !== "string" || !validarUUID(value)) {
                throw new Error("ID do exercício deve ser um UUID válido");
            }
            this.#idExercicio = value.trim();
        } else {
            this.#idExercicio = null;
        }
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

    set grupo_muscular(value) {
        if (typeof value !== "string" || !GRUPOS_MUSCULARES_VALIDOS.includes(value)) {
            throw new Error(
                `Grupo muscular inválido. Deve ser um dos seguintes: ${GRUPOS_MUSCULARES_VALIDOS.join(", ")}`
            );
        }

        this.#grupo_muscular = value;
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
            throw new Error("Descrição do exercício inválida");
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
            throw new Error("Caminho do vídeo inválido");
        }

        this.#caminho_video =
            value === null || value === undefined
                ? null
                : value.trim();
    }

    // =========================
    // FACTORY (Métodos de Criação)
    // =========================

    static criar({
        nome,
        grupo_muscular,
        descricao = null,
        caminho_video = null
    }) {
        return new Exercicio(
            nome,
            grupo_muscular,
            descricao,
            caminho_video
        );
    }

    static editar({
        idExercicio,
        nome,
        grupo_muscular,
        descricao = null,
        caminho_video = null
    }) {
        if (!idExercicio) {
            throw new Error("ID do exercício é obrigatório");
        }

        return new Exercicio(
            nome,
            grupo_muscular,
            descricao,
            caminho_video,
            String(idExercicio)
        );
    }
}