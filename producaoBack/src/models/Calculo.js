import { validarUUID } from "../utils/cryptoUtils.js";

export class Calculo {

    #idCalculo;
    #idDados;
    #imc;
    #tmb;
    #ndc;
    #treinos;
    #dataCalculo;
    #dataAtualizacaoCalculo;

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

        this.idCalculo = idCalculo;
        this.idDados = idDados;
        this.imc = imc;
        this.tmb = tmb;
        this.ndc = ndc;
        this.treinos = treinos;

        this.dataCalculo = dataCalculo;
        this.dataAtualizacaoCalculo =
            dataAtualizacaoCalculo;
    }

    // =========================
    // GETTERS
    // =========================

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

    // =========================
    // SETTERS
    // =========================

    set idCalculo(value) {

        if (
            value !== null &&
            value !== undefined
        ) {
            if (typeof value !== "string" || !validarUUID(value)) {
                throw new Error("ID do cálculo deve ser um UUID válido");
            }
            this.#idCalculo = value.trim();
        } else {
            this.#idCalculo = null;
        }
    }

    set idDados(value) {

        if (!value || typeof value !== "string" || !validarUUID(value)) {
            throw new Error("ID dos dados corporais deve ser um UUID válido");
        }

        this.#idDados = value.trim();
    }

    set imc(value) {

        const imc = Number(value);

        if (
            !Number.isFinite(imc) ||
            imc <= 0
        ) {
            throw new Error("IMC inválido");
        }

        this.#imc = imc;
    }

    set tmb(value) {

        const tmb = Number(value);

        if (
            !Number.isFinite(tmb) ||
            tmb <= 0
        ) {
            throw new Error("TMB inválida");
        }

        this.#tmb = tmb;
    }

    set ndc(value) {

        const ndc = Number(value);

        if (
            !Number.isFinite(ndc) ||
            ndc <= 0
        ) {
            throw new Error("NDC inválida");
        }

        this.#ndc = ndc;
    }

    set treinos(value) {

        if (!Array.isArray(value)) {
            throw new Error(
                "Treinos devem ser um array"
            );
        }

        this.#treinos = value;
    }

    set dataCalculo(value) {

        if (value === null || value === undefined) {
            this.#dataCalculo = null;
            return;
        }

        const data = new Date(value);

        if (isNaN(data.getTime())) {
            throw new Error(
                "Data do cálculo inválida"
            );
        }

        this.#dataCalculo = data;
    }

    set dataAtualizacaoCalculo(value) {

        if (value === null || value === undefined) {
            this.#dataAtualizacaoCalculo = null;
            return;
        }

        const data = new Date(value);

        if (isNaN(data.getTime())) {
            throw new Error(
                "Data de atualização inválida"
            );
        }

        this.#dataAtualizacaoCalculo = data;
    }

    // =========================
    // FACTORY
    // =========================

    static criar({
        idDados,
        imc,
        tmb,
        ndc,
        treinos = []
    }) {

        if (
            !idDados ||
            imc === undefined ||
            tmb === undefined ||
            ndc === undefined
        ) {
            throw new Error(
                "Dados obrigatórios faltando"
            );
        }

        return new Calculo(
            String(idDados),
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
            throw new Error(
                "ID do cálculo é obrigatório"
            );
        }

        return new Calculo(
            String(idDados),
            Number(imc),
            Number(tmb),
            Number(ndc),
            treinos,
            String(idCalculo),
            dataCalculo,
            dataAtualizacaoCalculo
        );
    }
}