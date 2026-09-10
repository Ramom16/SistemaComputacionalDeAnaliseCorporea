import { api } from './api';

export const evolucaoService = {
  // Busca o histórico de dados corporais / evolução do usuário
  getHistoricoEvolucao: async () => {
    return await api.get('/evolucao'); 
  },

  // Envia um novo registro de peso/medidas
  salvarEvolucao: async (dados) => {
    return await api.post('/evolucao', dados);
  },
};