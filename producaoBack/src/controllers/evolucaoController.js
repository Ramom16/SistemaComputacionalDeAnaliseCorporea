import HistoricoCorporalRepository from "../repositories/historicoCorporalRepository.js";
import EvolucaoService from "../services/evolucaoService.js";

const EvolucaoController = {

    buscar: async (req, res) => {
        try {
            const idUsuario = req.params.id ? Number(req.params.id) : req.usuario?.id;

            if (!idUsuario) {
                return res.status(400).json({ erro: "ID do usuário não fornecido." });
            }

            const historico = await HistoricoCorporalRepository.buscarPorUsuario(idUsuario);
            const grafico = EvolucaoService.gerarGrafico(historico);

            return res.status(200).json(grafico);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }
};

export default EvolucaoController;