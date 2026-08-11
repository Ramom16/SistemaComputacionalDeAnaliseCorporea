import treinoService from "../services/treinoService.js";

const treinoController = {

    async criar(req, res) {

        try {

            const idUsuario = req.usuario.id;

            const treino = await treinoService.criar(
                idUsuario,
                req.body
            );

            return res.status(201).json({
                message: "Treino criado com sucesso.",
                data: treino
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

            const treinos =
                await treinoService.listarPorUsuario(
                    idUsuario
                );

            return res.status(200).json({
                data: treinos
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    },

    async buscar(req, res) {

        try {

            const idUsuario = req.usuario.id;
            const idTreino = Number(req.params.idTreino);

            const treino =
                await treinoService.buscarPorId(
                    idUsuario,
                    idTreino
                );

            return res.status(200).json({
                data: treino
            });

        } catch (error) {

            return res.status(404).json({
                error: error.message
            });
        }
    }
};

export default treinoController;