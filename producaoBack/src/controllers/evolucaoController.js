import HistoricoCorporalRepository from "../repositories/historicoCorporalRepository.js";
import EvolucaoService from "../services/evolucaoService.js";

const EvolucaoController = {

    buscar: async (req, res) => {

        try {

            const idUsuario = String(req.params.id || req.usuario?.id);

            // Proteção contra IDOR
            if (req.usuario?.id && idUsuario !== req.usuario.id) {
                return res.status(403).json({
                    erro: "Você não possui permissão para visualizar o histórico de evolução deste usuário."
                });
            }

            const historico =
                await HistoricoCorporalRepository
                    .buscarPorUsuario(idUsuario);

            const grafico =
                EvolucaoService
                    .gerarGrafico(historico);

            return res.status(200).json(
                grafico
            );

        } catch (error) {

            return res.status(500).json({
                erro: error.message
            });

        }

    }

};

export default EvolucaoController;