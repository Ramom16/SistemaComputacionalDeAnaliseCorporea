import HistoricoCorporalRepository from "../repositories/historicoCorporalRepository.js";
import EvolucaoService from "../services/evolucaoService.js";
const EvolucaoController = {

    buscar: async (req,res)=>{

        try{

            const idUsuario =
                Number(req.params.idUsuario);

            const historico =
                await HistoricoCorporalRepository
                    .buscarPorUsuario(idUsuario);

            const grafico =
                EvolucaoService
                    .gerarGrafico(historico);

            return res.status(200).json(
                grafico
            );

        }catch(error){

            return res.status(500).json({
                erro:error.message
            });

        }

    }

};

export default EvolucaoController;