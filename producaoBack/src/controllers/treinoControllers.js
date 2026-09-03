import treinoService from "../services/treinoService.js";
import { anexarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";

const treinoController = {

    async criar(req, res) {

        try {

            const idUsuario = req.usuario.id;

            const treino = await treinoService.criar(
                String(idUsuario),
                req.body
            );

            return res.status(201).json({
                message: "Treino criado com sucesso.",
                data: anexarIdsCriptografados(treino)
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
                    String(idUsuario)
                );

            return res.status(200).json({
                data: anexarIdsCriptografados(treinos)
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
            const idTreino = String(req.params.idTreino);

            const treino =
                await treinoService.buscarPorId(
                    String(idUsuario),
                    idTreino
                );

            return res.status(200).json({
                data: anexarIdsCriptografados(treino)
            });

        } catch (error) {

            return res.status(404).json({
                error: error.message
            });
        }
    },

    async atualizar(req, res) {

        try {

            const idUsuario = req.usuario.id;
            const idTreino = String(req.params.idTreino);

            const treino =
                await treinoService.atualizar(
                    String(idUsuario),
                    idTreino,
                    req.body
                );

            return res.status(200).json({
                message: "Treino atualizado com sucesso.",
                data: anexarIdsCriptografados(treino)
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    },

    async deletar(req, res) {

        try {

            const idUsuario = req.usuario.id;
            const idTreino = String(req.params.idTreino);

            await treinoService.deletar(
                String(idUsuario),
                idTreino
            );

            return res.status(200).json({
                message: "Treino removido com sucesso."
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    }
};

export default treinoController;