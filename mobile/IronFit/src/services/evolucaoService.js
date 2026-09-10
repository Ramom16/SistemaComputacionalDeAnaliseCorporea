import { api } from './api';

export const evolucaoService = {

  getHistoricoEvolucao: async (usuarioId) => {
    const historico = await api.getHistorico(usuarioId);
    if (historico) return historico;

    const dados = await api.getDadosCorporais(usuarioId);
    return dados ? [dados] : [];
  },

 
  salvarEvolucao: async (dados, usuarioId) => {
    return await api.salvarDadosCorporais(dados, usuarioId);
  },
};