import treinoExercicioService
    from "../services/treinoExercicioService.js";

const treinoExercicioController = {

    async adicionar(req, res) {

        try {

            const idUsuario = req.usuario.id;
            const idTreino = Number(req.params.idTreino);

            const resultado =
                await treinoExercicioService.adicionar(
                    idUsuario,
                    idTreino,
                    req.body
                );

            return res.status(201).json({
                message: "Exercício adicionado ao treino.",
                data: resultado
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    },

    async listar(req, res) {

        try {

            const idUsuario = req.usuario.id;
            const idTreino = Number(req.params.idTreino);

            const exercicios =
                await treinoExercicioService.listar(
                    idUsuario,
                    idTreino
                );

            return res.status(200).json({
                data: exercicios
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    },

    async remover(req, res) {

        try {

            const idUsuario = req.usuario.id;
            const idTreino = Number(req.params.idTreino);
            const idExercicio =
                Number(req.params.idExercicio);

            await treinoExercicioService.remover(
                idUsuario,
                idTreino,
                idExercicio
            );

            return res.status(200).json({
                message: "Exercício removido do treino."
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    },

    async atualizar(req, res) {

        try {

            const idUsuario = req.usuario.id;
            const idTreino = Number(req.params.idTreino);
            const idExercicio =
                Number(req.params.idExercicio);

            const resultado =
                await treinoExercicioService.atualizar(
                    idUsuario,
                    idTreino,
                    idExercicio,
                    req.body
                );

            return res.status(200).json({
                message: "Exercício atualizado no treino.",
                data: resultado
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    }
};

export default treinoExercicioController;