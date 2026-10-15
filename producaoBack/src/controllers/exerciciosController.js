import exerciciosService from "../services/exerciciosService.js";
import { anexarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";

/** Mensagem padronizada para acesso negado a não-administradores */
const ERRO_ACESSO_ADMIN = "Acesso negado. Apenas administradores podem realizar esta operação.";

function bloquearSeNaoAdmin(req, res) {
    const role = String(req.usuario?.role || "").toUpperCase();
    if (role !== "ADMIN") {
        res.status(403).json({ erro: ERRO_ACESSO_ADMIN });
        return true;
    }
    return false;
}

const exerciciosController = {

    async criar(req, res) {

        // Guard de role – defesa em profundidade (a rota já aplica eAdmin)
        if (bloquearSeNaoAdmin(req, res)) return;

        try {

            const exercicio =
                await exerciciosService.criar(req.body);

            return res.status(201).json({
                message: "Exercício criado com sucesso.",
                data: anexarIdsCriptografados(exercicio)
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
                data: anexarIdsCriptografados(exercicios)
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
                String(req.params.idExercicio);

            const exercicio =
                await exerciciosService.buscarPorId(
                    idExercicio
                );

            return res.status(200).json({
                data: anexarIdsCriptografados(exercicio)
            });

        } catch (error) {

            return res.status(404).json({
                error: error.message
            });
        }
    },

    async atualizar(req, res) {

        // Guard de role – defesa em profundidade (a rota já aplica eAdmin)
        if (bloquearSeNaoAdmin(req, res)) return;

        try {

            const idExercicio =
                String(req.params.idExercicio);

            const exercicio =
                await exerciciosService.atualizar(
                    idExercicio,
                    req.body
                );

            return res.status(200).json({
                message: "Exercício atualizado com sucesso.",
                data: anexarIdsCriptografados(exercicio)
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    },

    async deletar(req, res) {

        // Guard de role – defesa em profundidade (a rota já aplica eAdmin)
        if (bloquearSeNaoAdmin(req, res)) return;

        try {

            const idExercicio =
                String(req.params.idExercicio);

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
