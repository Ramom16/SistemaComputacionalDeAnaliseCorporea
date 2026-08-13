import exerciciosService from "../services/exerciciosService.js";

const exerciciosController = {

    async criar(req, res) {

        try {

            const exercicio =
                await exerciciosService.criar(req.body);

            return res.status(201).json({
                message: "Exercício criado com sucesso.",
                data: exercicio
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    },

    async listar(req, res) {

        try {

            const exercicios =
                await exerciciosService.listar();

            return res.status(200).json({
                data: exercicios
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    },

    async buscar(req, res) {

        try {

            const idExercicio =
                Number(req.params.idExercicio);

            const exercicio =
                await exerciciosService.buscarPorId(
                    idExercicio
                );

            return res.status(200).json({
                data: exercicio
            });

        } catch (error) {

            return res.status(404).json({
                error: error.message
            });
        }
    },

    async atualizar(req, res) {

        try {

            const idExercicio =
                Number(req.params.idExercicio);

            const exercicio =
                await exerciciosService.atualizar(
                    idExercicio,
                    req.body
                );

            return res.status(200).json({
                message: "Exercício atualizado com sucesso.",
                data: exercicio
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    },

    async deletar(req, res) {

        try {

            const idExercicio =
                Number(req.params.idExercicio);

            await exerciciosService.deletar(idExercicio);

            return res.status(200).json({
                message: "Exercício removido com sucesso."
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    }
};

export default exerciciosController;
