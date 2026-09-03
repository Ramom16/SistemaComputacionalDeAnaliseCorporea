import treinoExercicioService from "../services/treinoExercicioService.js";
import { anexarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";

const treinoExercicioController = {

    async adicionar(req, res) {

        try {

            const idUsuario = req.usuario.id;
            const idTreino = String(req.params.idTreino);

            if (Array.isArray(req.body)) {
                const resultados = [];
                for (const item of req.body) {
                    const resultado = await treinoExercicioService.adicionar(
                        String(idUsuario),
                        idTreino,
                        item
                    );
                    resultados.push(resultado);
                }

                return res.status(201).json({
                    message: "Exercícios adicionados ao treino com sucesso.",
                    data: anexarIdsCriptografados(resultados)
                });
            } else {
                const resultado =
                    await treinoExercicioService.adicionar(
                        String(idUsuario),
                        idTreino,
                        req.body
                    );

                return res.status(201).json({
                    message: "Exercício adicionado ao treino com sucesso.",
                    data: anexarIdsCriptografados(resultado)
                });
            }

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    },

    async listar(req, res) {

        try {

            const idUsuario = req.usuario.id;
            const idTreino = String(req.params.idTreino);

            const exercicios =
                await treinoExercicioService.listar(
                    String(idUsuario),
                    idTreino
                );

            return res.status(200).json({
                data: anexarIdsCriptografados(exercicios)
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
            const idTreino = String(req.params.idTreino);
            const idExercicio = String(req.params.idExercicio);

            await treinoExercicioService.remover(
                String(idUsuario),
                idTreino,
                idExercicio
            );

            return res.status(200).json({
                message: "Exercício removido do treino com sucesso."
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
            const idTreino = String(req.params.idTreino);
            const idExercicio = String(req.params.idExercicio);

            const atualizado =
                await treinoExercicioService.atualizar(
                    String(idUsuario),
                    idTreino,
                    idExercicio,
                    req.body
                );

            return res.status(200).json({
                message: "Exercício do treino atualizado com sucesso.",
                data: anexarIdsCriptografados(atualizado)
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    }
};

export default treinoExercicioController;