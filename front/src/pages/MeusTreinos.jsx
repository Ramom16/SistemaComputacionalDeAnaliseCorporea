import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import "../styles/dashboard.css";
import "../styles/meustreinos.css";
import api from "../services/api";

export default function MeusTreinos() {
  const navigate = useNavigate();
  const [treinos, setTreinos] = useState([]);
  const [filtroObjetivo, setFiltroObjetivo] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [usuarioData, setUsuarioData] = useState(null);

  useEffect(() => {
    async function buscarTreinosAPI() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        
        // Busca os dados do usuário para personalização
        const usuarioSalvo = JSON.parse(localStorage.getItem("usuario") || "{}");
        setUsuarioData(usuarioSalvo);

        // Busca os treinos cadastrados no seu banco de dados
        const response = await api.get("/treinos");

        console.log("Treinos recebidos da API:", response.data);
        setTreinos(response.data.data || response.data || []);
      } catch (err) {
        console.error("Erro ao carregar treinos da API:", err);
        setErro("Não foi possível carregar os treinos no momento. Tente novamente mais tarde.");
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
    "Resistencia",
    "Condicionamento",
  ];

  // Filtra os treinos recebidos da API
  const treinosFiltrados = treinos.filter(
    (t) => filtroObjetivo === "Todos" || t.objetivo === filtroObjetivo
  );

  return (
    <>
      <DashboardNavbar onLogout={handleLogout} />
      <div className="dashboard-layout">
        <main className="dashboard-content">
        {/* Seção de Bem-vindo + Botão Admin */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '30px'
        }}>
          <div style={{ flex: 1 }}>
            <h1 className="welcome-title">
              Meus <span>Treinos</span>
            </h1>
            <p className="welcome-desc">
              {usuarioData?.nome ? `Explore os planos de treino personalizados para você, ${usuarioData.nome}.` : "Explore os planos de treino disponíveis no sistema para o seu perfil."}
            </p>
          </div>
          
          {usuarioData?.role === 'ADMIN' && (
            <button
              onClick={() => navigate('/admin/criar-treino')}
              style={{
                background: 'linear-gradient(135deg, var(--primary-yellow) 0%, #ffd700 100%)',
                color: '#000',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                marginLeft: '20px',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(255, 230, 0, 0.2)'
              }}
              onMouseHover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(255, 230, 0, 0.4)'
              }}
            >
              + Criar Treino Global
            </button>
          )}
        </div>
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
        {loading && <p className="loading-txt">Carregando treinos personalizados da API...</p>}
        {erro && <p className="erro-txt">{erro}</p>}

        {!loading && !erro && treinosFiltrados.length === 0 && (
          <p className="vazio-txt">
            Nenhum treino encontrado para o filtro "{filtroObjetivo}". Tente selecionar outro objetivo!
          </p>
        )}

        {/* Grid de Treinos vindo do Banco - RF-007: Treinos Personalizados */}
        {!loading && !erro && treinosFiltrados.length > 0 && (
          <div className="treinos-grid">
            {treinosFiltrados.map((treino) => (
              <TreinoCard
                key={treino.idTreino || treino.id}
                treino={treino}
                onClick={() => navigate(`/treino/${treino.idTreino || treino.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
    </>
  );
}

function TreinoCard({ treino, onClick }) {
  // Mapeia cores por objetivo para melhor visualização
  const coresPorObjetivo = {
    "Hipertrofia": "#FF6B6B",
    "Emagrecimento": "#4ECDC4",
    "Resistencia": "#FFD93D",
    "Condicionamento": "#6BCB77",
  };

  return (
    <div
      className="treino-card"
      onClick={onClick}
      style={{ 
        "--card-cor": coresPorObjetivo[treino.objetivo] || "#f5c300",
        cursor: "pointer",
        transition: "transform 0.2s ease"
      }}
    >
      <div className="treino-card-topo">
        <span className="treino-objetivo">{treino.objetivo || "Geral"}</span>
        <span className="treino-nivel">Nível: {treino.nivel || "Iniciante"}</span>
      </div>

      <h3 className="treino-titulo">{treino.titulo || `Treino ${treino.objetivo}`}</h3>
      <p className="treino-desc">{treino.descricao || "Treino personalizado para seu perfil"}</p>

      <div className="treino-info">
        {treino.treinoExercicios && (
          <span>💪 {treino.treinoExercicios.length} exercícios</span>
        )}
        {treino.data_criacao && (
          <span>📅 {new Date(treino.data_criacao).toLocaleDateString("pt-BR")}</span>
        )}
        <span>👤 {treino.nivel || "Iniciante"}</span>
      </div>

      <div className="treino-card-footer">
        <span className="ver-treino">Ver treino e exercícios →</span>
      </div>
    </div>
  );
}