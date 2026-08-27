import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import "../styles/meustreinos.css";
import api from "../services/api";

export default function MeusTreinos() {
  const navigate = useNavigate();
  const [treinos, setTreinos] = useState([]);
  const [filtroObjetivo, setFiltroObjetivo] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarTreinosAPI() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        // Busca os treinos cadastrados no seu banco de dados
        const response = await api.get("/treinos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTreinos(response.data);
      } catch (err) {
        console.error("Erro ao carregar treinos da API:", err);
        setErro("Não foi possível carregar os treinos no momento.");
      } finally {
        setLoading(false);
      }
    }

    buscarTreinosAPI();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const objetivos = [
    "Todos",
    "Hipertrofia",
    "Emagrecimento",
    "Manutenção",
    "Força",
  ];

  // Filtra os treinos recebidos da API
  const treinosFiltrados = treinos.filter(
    (t) => filtroObjetivo === "Todos" || t.objetivo === filtroObjetivo
  );

  return (
    <div className="dashboard-layout">
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
          <Link to="/meus-treinos" className="active">
            Meus Treinos
          </Link>
          <Link to="/evolucao">Evolução</Link>
          <Link to="#">Configurações</Link>
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          Sair da Conta
        </button>
      </aside>

      <main className="dashboard-content">
        <section className="welcome-section">
          <h1 className="welcome-title">
            Meus <span>Treinos</span>
          </h1>
          <p className="welcome-desc">
            Explore os planos de treino disponíveis no sistema para o seu perfil.
          </p>
        </section>

        {/* Filtros */}
        <div className="treinos-filtros">
          {objetivos.map((obj) => (
            <button
              key={obj}
              className={`filtro-btn ${filtroObjetivo === obj ? "active" : ""}`}
              onClick={() => setFiltroObjetivo(obj)}
            >
              {obj}
            </button>
          ))}
        </div>

        {/* Estado de Carregamento e Mensagens */}
        {loading && <p className="loading-txt">Carregando treinos da API...</p>}
        {erro && <p className="erro-txt">{erro}</p>}

        {!loading && !erro && treinosFiltrados.length === 0 && (
          <p className="vazio-txt">Nenhum treino encontrado no banco de dados.</p>
        )}

        {/* Grid de Treinos vindo do Banco */}
        {!loading && !erro && treinosFiltrados.length > 0 && (
          <div className="treinos-grid">
            {treinosFiltrados.map((treino) => (
              <TreinoCard
                key={treino.id}
                treino={treino}
                onClick={() => navigate(`/treino/${treino.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function TreinoCard({ treino, onClick }) {
  return (
    <div
      className="treino-card"
      onClick={onClick}
      style={{ "--card-cor": treino.cor || "#f5c300" }}
    >
      <div className="treino-card-topo">
        <span className="treino-objetivo">{treino.objetivo || "Geral"}</span>
      </div>

      <h3 className="treino-titulo">{treino.titulo}</h3>
      <p className="treino-desc">{treino.descricao}</p>

      <div className="treino-info">
        {treino.dias && <span>📅 {treino.dias}</span>}
        {treino.experiencia && <span>👤 {treino.experiencia}</span>}
        {treino.faixaEtaria && <span>🎯 {treino.faixaEtaria}</span>}
      </div>

      <div className="treino-card-footer">
        <span className="ver-treino">Ver treino →</span>
      </div>
    </div>
  );
}