import { useEvolucao } from "../hooks/useEvolucao";

import Header from "../components/evolucao/Header";
import DashboardCards from "../components/evolucao/DashboardCards";
import EvolucaoGrafico from "../components/evolucao/EvolucaoGrafico";
import ExerciciosGrafico from "../components/evolucao/ExerciciosGrafico";
import GrupoMuscularGrafico from "../components/evolucao/GrupoMuscularGrafico";
import Recordes from "../components/evolucao/Recordes";
import CalendarioTreinos from "../components/evolucao/CalendarioTreinos";
import HistoricoTabela from "../components/evolucao/HistoricoTabela";

import "../styles/evolucao.css";

export default function Evolucao() {

    const {
        loading,
        cards,
        historico,
        exercicios,
        grupos,
        recordes
    } = useEvolucao();

    if (loading) {
        return (
            <div className="loading">
                Carregando...
            </div>
        );
    }

    return (

        <div className="evolucao-page">

            <Header />

            <DashboardCards cards={cards} />

            <div className="graficos-grid">

                <EvolucaoGrafico
                    dados={historico}
                />

                <ExerciciosGrafico
                    dados={exercicios}
                />

                <GrupoMuscularGrafico
                    dados={grupos}
                />

            </div>

            <Recordes
                dados={recordes}
            />

            <CalendarioTreinos
                dados={historico}
            />

            <HistoricoTabela
                dados={historico}
            />

        </div>

    );

}