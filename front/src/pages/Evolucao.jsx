import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEvolucao } from "../hooks/useEvolucao";
import DashboardNavbar from "../components/DashboardNavbar";

import Header from "../components/evolucao/Header";
import DashboardCards from "../components/evolucao/DashboardCards";
import EvolucaoGrafico from "../components/evolucao/EvolucaoGrafico";
import ExerciciosGrafico from "../components/evolucao/ExercicioGrafico";
import GrupoMuscularGrafico from "../components/evolucao/GrupoMuscularGrafico";
import Recordes from "../components/evolucao/Records";
import CalendarioTreinos from "../components/evolucao/CalendarioTreinos";
import HistoricoTabela from "../components/evolucao/HistoricoTabela";

import "../styles/dashboard.css";
import "../styles/evolucao.css";

export default function Evolucao() {
    const navigate = useNavigate();

    const {
        loading,
        erro,
        cards,
        historico,
        exercicios,
        grupos,
        recordes
    } = useEvolucao();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="loading">
                Carregando evolução...
            </div>
        );
    }

    if (erro) {
        return (
            <div className="loading" role="alert">
                {erro}
            </div>
        );
    }

    return (
        <>
            <DashboardNavbar onLogout={handleLogout} />
            <div className="dashboard-layout">
                {/* Conteúdo Principal */}
                <main className="dashboard-content">
                <Header />

                <DashboardCards cards={cards} />

                <div className="graficos-grid">
                    <EvolucaoGrafico dados={historico} />
                    <ExerciciosGrafico dados={exercicios} />
                    <GrupoMuscularGrafico dados={grupos} />
                </div>

                <Recordes dados={recordes} />

                <CalendarioTreinos dados={historico} />

                <HistoricoTabela dados={historico} />
            </main>
        </div>
        </>
    );
}
