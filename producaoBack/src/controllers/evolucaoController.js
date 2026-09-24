import HistoricoCorporalRepository from "../repositories/historicoCorporalRepository.js";
import EvolucaoService from "../services/evolucaoService.js";

const EvolucaoController = {

    buscar: async (req, res) => {

        try {

            const idUsuario = String(req.params.id || req.usuario?.id);

            // Proteção contra IDOR: permite visualização própria ou por administrador
            if (req.usuario?.id && idUsuario !== req.usuario.id && req.usuario.role !== "ADMIN") {
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

    },

    estatisticas: async (req, res) => {
        try {
            const idUsuario = String(req.params.idUsuario);

            // Proteção contra IDOR: permite visualização própria ou por administrador
            if (req.usuario?.id && idUsuario !== req.usuario.id && req.usuario.role !== "ADMIN") {
                return res.status(403).json({
                    erro: "Você não possui permissão para visualizar estas estatísticas."
                });
            }

            const estatisticas = await EvolucaoService.gerarEstatisticas(idUsuario);
            return res.status(200).json(estatisticas);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }

};

export default EvolucaoController;