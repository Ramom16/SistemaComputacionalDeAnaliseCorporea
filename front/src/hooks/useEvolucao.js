import { useState, useEffect } from "react";
import api from "../services/api";

export function useEvolucao() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [historico, setHistorico] = useState([]);
  const [exercicios, setExercicios] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [recordes, setRecordes] = useState({
    supinoMax: "0 kg",
    agachamentoMax: "0 kg",
    diasSeguidos: "0 dias",
    maiorPerdaPeso: "0 kg",
    totalHoras: "0 hrs",
    caloriasQueimadas: "0 kcal",
  });
  const [cards, setCards] = useState({
    totalTreinos: 0,
    totalExercicios: 0,
    tempoTreinado: 0,
    calorias: 0,
  });

  useEffect(() => {
    async function carregarEvolucao() {
      const usuarioSalvo = JSON.parse(
        localStorage.getItem("usuario") || "{}"
      );
      const idUsuario = usuarioSalvo.id;

      if (!idUsuario) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [historicoResponse, estatisticasResponse] = await Promise.all([
          api.get(`/historico/usuario/${idUsuario}`),
          api.get(`/evolucao/estatisticas/${idUsuario}`),
        ]);

        const data = historicoResponse.data;
        const estatisticas = estatisticasResponse.data;
        const peso = data.peso?.dados || [];
        const imc = data.imc?.dados || [];
        const tmb = data.tmb?.dados || [];
        const ndc = data.ndc?.dados || [];

        setHistorico(peso.map((item, index) => ({
          id: index + 1,
          data: item.data,
          peso: Number(item.valor || 0),
          imc: Number(Number(imc[index]?.valor || 0).toFixed(1)),
          tmb: Math.round(Number(tmb[index]?.valor || 0)),
          ndc: Math.round(Number(ndc[index]?.valor || 0)),
          classificacao: "Medição",
        })));
        setCards(estatisticas.cards || {});
        setExercicios(estatisticas.exercicios || []);
        setGrupos(estatisticas.grupos || []);
        setRecordes(estatisticas.recordes || {});
      } catch (err) {
        console.error("Erro ao carregar evolução do banco:", err);
        setErro("Não foi possível carregar os dados de evolução.");
      } finally {
        setLoading(false);
      }
    }

    carregarEvolucao();
  }, []);

  return {
    loading,
    erro,
    cards,
    historico,
    exercicios,
    grupos,
    recordes,
  };
}