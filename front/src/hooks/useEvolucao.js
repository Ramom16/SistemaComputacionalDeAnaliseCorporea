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
      const token = localStorage.getItem("token");
      const idUsuario = usuarioSalvo.id;

      if (!idUsuario) {
        setLoading(false);
        return;
      }

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        setLoading(true);

        // Executa as requisições para a API em paralelo
        const [resCorporal, resTreinos] = await Promise.allSettled([
          api.get(`/dadosCorporais/usuario/${idUsuario}`, { headers }),
          api.get(`/evolucao/usuario/${idUsuario}`, { headers }),
        ]);

        // 1. Processa dados de medição corporal (Histórico de Peso, IMC, TMB, NDC)
        if (
          resCorporal.status === "fulfilled" &&
          resCorporal.value.data?.calculos
        ) {
          const calculosFormatados = resCorporal.value.data.calculos
            .map((item, index) => {
              const dataObj = new Date(
                item.created_at || item.createdAt || Date.now()
              );
              const diaMes = `${String(dataObj.getDate()).padStart(
                2,
                "0"
              )}/${String(dataObj.getMonth() + 1).padStart(2, "0")}`;

              return {
                id: item.id || index + 1,
                data: diaMes,
                peso: Number(item.peso_kg || item.peso || 0),
                imc: Number(Number(item.imc || 0).toFixed(1)),
                tmb: Math.round(Number(item.tmb || 0)),
                ndc: Math.round(Number(item.ndc || 0)),
                classificacao:
                  item.classificacao_imc ||
                  item.classificacao ||
                  "Medição",
              };
            })
            .reverse();

          setHistorico(calculosFormatados);
        }

        // 2. Processa estatísticas de treinos e recordes (se retornado pela API)
        if (resTreinos.status === "fulfilled" && resTreinos.value.data) {
          const data = resTreinos.value.data;

          if (data.cards) setCards(data.cards);
          if (data.exercicios) setExercicios(data.exercicios);
          if (data.grupos) setGrupos(data.grupos);
          if (data.recordes) setRecordes(data.recordes);
        }
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