import exerciciosRepository from "../repositories/exerciciosRepositories.js";
import { Exercicio } from "../models/Exercicios.js";

const exerciciosService = {

    async criar(dados) {
        const exercicio = Exercicio.criar(dados);

        return await exerciciosRepository.criar({
            nome: exercicio.nome,
            descricao: exercicio.descricao,
            caminho_video: exercicio.caminho_video,
            grupo_muscular: dados.grupo_muscular || null
        });
    },

    async listar() {
        return await exerciciosRepository.listar();
    },

    async buscarPorId(idExercicio) {
        const exercicio =
            await exerciciosRepository.buscarPorId(
                String(idExercicio)
            );

        if (!exercicio) {
            throw new Error("Exercício não encontrado.");
        }

        return exercicio;
    },

    async atualizar(idExercicio, dados) {
        await this.buscarPorId(idExercicio);

        const exercicio = Exercicio.editar({
            idExercicio: String(idExercicio),
            nome: dados.nome,
            descricao: dados.descricao,
            caminho_video: dados.caminho_video
        });

        return await exerciciosRepository.atualizar(
            exercicio.idExercicio,
            {
                nome: exercicio.nome,
                descricao: exercicio.descricao,
                caminho_video: exercicio.caminho_video,
                grupo_muscular: dados.grupo_muscular || null
            }
        );
    },

    async deletar(idExercicio) {
        await this.buscarPorId(idExercicio);
        return await exerciciosRepository.deletar(
            String(idExercicio)
        );
    }
};

export default exerciciosService;