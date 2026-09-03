import exerciciosService from "../services/exerciciosService.js";
import { anexarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";

const exerciciosController = {

    async criar(req, res) {
        try {
            const { nome, descricao, caminho_video, grupo_muscular } = req.body;

            const exercicio = await exerciciosService.criar({
                nome,
                descricao,
                caminho_video,
                grupo_muscular
            });

            return res.status(201).json({
                message: "Exercício criado com sucesso.",
                data: anexarIdsCriptografados(exercicio)
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async listar(req, res) {
        try {
<<<<<<< HEAD
            const exercicios = await exerciciosService.listar();
            return res.status(200).json({ data: exercicios });
=======

            const exercicios =
                await exerciciosService.listar();

            return res.status(200).json({
                data: anexarIdsCriptografados(exercicios)
            });

>>>>>>> producaoBack
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async buscar(req, res) {
        try {
            const idExercicio = Number(req.params.idExercicio);
            const exercicio = await exerciciosService.buscarPorId(idExercicio);

<<<<<<< HEAD
            return res.status(200).json({ data: exercicio });
=======
            const idExercicio =
                String(req.params.idExercicio);

            const exercicio =
                await exerciciosService.buscarPorId(
                    idExercicio
                );

            return res.status(200).json({
                data: anexarIdsCriptografados(exercicio)
            });

>>>>>>> producaoBack
        } catch (error) {
            return res.status(404).json({ error: error.message });
        }
    },

    async atualizar(req, res) {
        try {
            const idExercicio = Number(req.params.idExercicio);
            const { nome, descricao, caminho_video, grupo_muscular } = req.body;

<<<<<<< HEAD
            const exercicio = await exerciciosService.atualizar(idExercicio, {
                nome,
                descricao,
                caminho_video,
                grupo_muscular
            });
=======
            const idExercicio =
                String(req.params.idExercicio);

            const exercicio =
                await exerciciosService.atualizar(
                    idExercicio,
                    req.body
                );
>>>>>>> producaoBack

            return res.status(200).json({
                message: "Exercício atualizado com sucesso.",
                data: anexarIdsCriptografados(exercicio)
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async deletar(req, res) {
        try {
<<<<<<< HEAD
            const idExercicio = Number(req.params.idExercicio);
=======

            const idExercicio =
                String(req.params.idExercicio);

>>>>>>> producaoBack
            await exerciciosService.deletar(idExercicio);

            return res.status(200).json({
                message: "Exercício removido com sucesso."
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
};

export default exerciciosController;