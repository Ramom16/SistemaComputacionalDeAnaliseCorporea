import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEvolucao } from "../hooks/useEvolucao";

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

    return (
        <div className="dashboard-layout">
            {/* Sidebar de Navegação */}
            <aside className="dashboard-sidebar">
                <Link to="/" className="sidebar-logo">
                    <div className="logo-icon">
                        <span className="logo-bar"></span>
                        <span className="logo-bar"></span>
                        <span className="logo-bar"></span>
                    </div>
                    <span className="logo-text">IRONFIT</span>
                </Link>

                <nav className="sidebar-nav">
                    <Link to="/dashboard">Análise Corporal</Link>
                    <Link to="/meus-treinos">Meus Treinos</Link>
                    <Link to="/evolucao" className="active">Evolução</Link>
                    <Link to="#">Configurações</Link>
                </nav>

                <button onClick={handleLogout} className="logout-btn">
                    Sair da Conta
                </button>
            </aside>

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
    );
}