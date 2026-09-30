import { useEffect, useState } from 'react';
import api, { getApiError } from '../services/api';
import { getUsuario } from '../services/auth';

const VAZIO = {
  cards: { totalTreinos: 0, totalExercicios: 0, tempoTreinado: 0, calorias: 0 },
  recordes: {},
  exercicios: [],
  grupos: [],
};

const numero = (valor) => Number(valor) || 0;

/** Aceita a série como array puro ou como { dados, media } devolvido pela API. */
function serie(bruto) {
  if (Array.isArray(bruto)) return bruto;
  if (Array.isArray(bruto?.dados)) return bruto.dados;
  return [];
}

/** Junta as 4 séries (peso/imc/tmb/ndc) em uma linha por medição, na ordem da API. */
function paraHistorico(bruto) {
  const peso = serie(bruto?.peso);
  const imc = serie(bruto?.imc);
  const tmb = serie(bruto?.tmb);
  const ndc = serie(bruto?.ndc);

  return peso.map((item, i) => ({
    id: i + 1,
    data: item.data,
    peso: numero(item.valor),
    imc: Math.round(numero(imc[i]?.valor) * 10) / 10,
    tmb: Math.round(numero(tmb[i]?.valor)),
    ndc: Math.round(numero(ndc[i]?.valor)),
    classificacao: 'Medição',
  }));
}

export function useEvolucao() {
  const idUsuario = getUsuario().id;

  const [carregado, setCarregado] = useState(false);
  const [erro, setErro] = useState('');
  const [dados, setDados] = useState({ historico: [], ...VAZIO });

  useEffect(() => {
    if (!idUsuario) return;

    let ativo = true;

    Promise.all([
      api.get(`/historico/usuario/${idUsuario}`),
      api.get(`/evolucao/estatisticas/${idUsuario}`),
    ])
      .then(([historicoRes, statsRes]) => {
        if (!ativo) return;
        const evolucao = historicoRes.data ?? {};
        setDados({
          ...VAZIO,
          ...statsRes.data,
          historico: paraHistorico(evolucao),
        });
      })
      .catch((err) => {
        if (!ativo) return;
        console.error('Erro ao carregar evolução do banco:', getApiError(err));
        setErro('Não foi possível carregar os dados de evolução.');
      })
      .finally(() => { if (ativo) setCarregado(true); });

    return () => { ativo = false; };
  }, [idUsuario]);

  return { loading: !carregado, erro, ...dados };
}
