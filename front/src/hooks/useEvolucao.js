import { useState, useEffect } from "react";
import api from "../services/api";

//Demonstração de dados para utilizar e que servirão de base para novas implementações, com base em conversa com professor

const DEMO_HISTORICO = [
    { id: 1, data: "10/04", peso: 84.5, imc: 27.2, tmb: 1910, ndc: 2650, classificacao: "Sobrepeso" },
    { id: 2, data: "25/04", peso: 83.2, imc: 26.8, tmb: 1890, ndc: 2610, classificacao: "Sobrepeso" },
    { id: 3, data: "10/05", peso: 82.0, imc: 26.4, tmb: 1875, ndc: 2580, classificacao: "Sobrepeso" },
    { id: 4, data: "25/05", peso: 80.8, imc: 26.0, tmb: 1860, ndc: 2550, classificacao: "Sobrepeso" },
    { id: 5, data: "10/06", peso: 79.5, imc: 25.6, tmb: 1840, ndc: 2520, classificacao: "Sobrepeso" },
    { id: 6, data: "25/06", peso: 78.2, imc: 25.2, tmb: 1825, ndc: 2490, classificacao: "Peso Normal" },
    { id: 7, data: "10/07", peso: 77.0, imc: 24.8, tmb: 1810, ndc: 2460, classificacao: "Peso Normal" }
];

const DEMO_EXERCICIOS = [
    { nome: "Supino Inclinado", vezes: 28, grupo: "Peitoral" },
    { nome: "Leg Press 45°", vezes: 24, grupo: "Pernas" },
    { nome: "Puxador Alto", vezes: 22, grupo: "Costas" },
    { nome: "Elevação Lateral", vezes: 20, grupo: "Ombros" },
    { nome: "Tríceps Polia", vezes: 18, grupo: "Braços" },
    { nome: "Rosca Scott", vezes: 16, grupo: "Braços" }
];

const DEMO_GRUPOS = [
    { grupo: "Peitoral", quantidade: 32 },
    { grupo: "Costas", quantidade: 30 },
    { grupo: "Pernas", quantidade: 28 },
    { grupo: "Ombros", quantidade: 22 },
    { grupo: "Braços", quantidade: 24 },
    { grupo: "Abdômen", quantidade: 18 }
];

const DEMO_RECORDES = {
    supinoMax: "95 kg",
    agachamentoMax: "120 kg",
    diasSeguidos: "12 dias",
    maiorPerdaPeso: "7.5 kg",
    totalHoras: "48 hrs",
    caloriasQueimadas: "18.400 kcal"
};

export function useEvolucao() {
    const [loading, setLoading] = useState(true);
    const [historico, setHistorico] = useState(DEMO_HISTORICO);
    const [exercicios, setExercicios] = useState(DEMO_EXERCICIOS);
    const [grupos, setGrupos] = useState(DEMO_GRUPOS);
    const [recordes, setRecordes] = useState(DEMO_RECORDES);
    const [cards, setCards] = useState({
        totalTreinos: 34,
        totalExercicios: 154,
        tempoTreinado: 48,
        calorias: 18400
    });

    useEffect(() => {
        async function carregarEvolucao() {
            const usuarioSalvo = JSON.parse(localStorage.getItem('usuario') || '{}');
            const token = localStorage.getItem('token');
            const idUsuario = usuarioSalvo.id;

            if (idUsuario) {
                try {
                    const response = await api.get(`/dadosCorporais/usuario/${idUsuario}`, {
                        headers: token ? { Authorization: `Bearer ${token}` } : {}
                    });
                    
                    if (response.data && response.data.calculos && response.data.calculos.length > 0) {
                        const calculosFormatados = response.data.calculos.map((item, index) => {
                            const dataObj = new Date(item.created_at || Date.now());
                            const diaMes = `${String(dataObj.getDate()).padStart(2, '0')}/${String(dataObj.getMonth() + 1).padStart(2, '0')}`;
                            return {
                                id: item.id || index + 1,
                                data: diaMes,
                                peso: Number(item.peso_kg || 0),
                                imc: Number(Number(item.imc || 0).toFixed(1)),
                                tmb: Math.round(Number(item.tmb || 0)),
                                ndc: Math.round(Number(item.ndc || 0)),
                                classificacao: item.classificacao_imc || 'Medição'
                            };
                        }).reverse();

                        if (calculosFormatados.length > 0) {
                            setHistorico(calculosFormatados);
                        }
                    }
                } catch (err) {
                    console.log("Usando dados ilustrativos de evolução:", err);
                }
            }
            setLoading(false);
        }

        carregarEvolucao();
    }, []);

    return {
        loading,
        cards,
        historico,
        exercicios,
        grupos,
        recordes
    };
}
