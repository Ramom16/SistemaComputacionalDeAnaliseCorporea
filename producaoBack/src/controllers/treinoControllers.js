import { Treino } from "../models/Treino.js";
import treinoRepository from "../repositories/treinoRepository.js";

const TreinoController = {

    criar: async (req, res) => {
        try {
            const {
                idTreino,
                idCalculo,
                objetivo,
                nivel,
                data_criacao
            } = req.body;


        } catch (error) {
            console.error("Erro ao criar treino:", error);
            res.status(500).json({ message: "Erro interno do servidor" });
        }
    },
    listar: async (req, res) => {
        try {
            const treinos = await treinoRepository.listar();
            res.status(200).json(treinos);
        } catch (error) {
            console.error("Erro ao listar treinos:", error);
            res.status(500).json({ message: "Erro interno do servidor" });
        }
    },

    editar: async (req, res) => {
        try {
            const {
                idTreino,
                idCalculo,
                objetivo,
                nivel,
                data_criacao
            } = req.body;
        } catch (error) {
            console.error("Erro ao editar treino:", error);
            res.status(500).json({ message: "Erro interno do servidor" });
        }

    }

}



export default TreinoController;