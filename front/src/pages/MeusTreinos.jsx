import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import "../styles/meustreinos.css";
import api from "../services/api";

// Base de dados de treinos
const TREINOS = [
  {
    id: 1,
    titulo: "Hipertrofia — Iniciante",
    objetivo: "Hipertrofia",
    experiencia: "Iniciante",
    dias: "3x por semana",
    faixaEtaria: "Todas",
    descricao:
      "Full Body ideal para quem está começando. Foco em técnica e aprendizado dos movimentos.",
    tags: ["Full Body", "3 dias", "Máquinas"],
    cor: "#f5c300",
  },
  {
    id: 2,
    titulo: "Hipertrofia — Intermediário",
    objetivo: "Hipertrofia",
    experiencia: "Intermediário",
    dias: "4x por semana",
    faixaEtaria: "18–40 anos",
    descricao:
      "Divisão ABC com foco em hipertrofia. Progressão de carga e maior volume semanal.",
    tags: ["ABC", "4 dias", "Livre + Máquinas"],
    cor: "#f5c300",
  },
  {
    id: 3,
    titulo: "Hipertrofia — Avançado",
    objetivo: "Hipertrofia",
    experiencia: "Avançado",
    dias: "5–6x por semana",
    faixaEtaria: "18–40 anos",
    descricao:
      "Push/Pull/Legs com técnicas avançadas. Alto volume e intensidade.",
    tags: ["PPL", "6 dias", "Livre + Máquinas"],
    cor: "#f5c300",
  },
  {
    id: 4,
    titulo: "Hipertrofia — 40 a 60 anos",
    objetivo: "Hipertrofia",
    experiencia: "Qualquer",
    dias: "3–4x por semana",
    faixaEtaria: "40–60 anos",
    descricao:
      "Foco em máquinas para proteger articulações. Maior atenção à mobilidade e recuperação.",
    tags: ["Upper/Lower", "3–4 dias", "Máquinas"],
    cor: "#f5c300",
  },
  {
    id: 5,
    titulo: "Hipertrofia — 60+ anos",
    objetivo: "Hipertrofia",
    experiencia: "Qualquer",
    dias: "2–3x por semana",
    faixaEtaria: "60+ anos",
    descricao:
      "Apenas máquinas. Foco em equilíbrio, preservação muscular e independência.",
    tags: ["Full Body", "2–3 dias", "Máquinas"],
    cor: "#f5c300",
  },
  {
    id: 6,
    titulo: "Emagrecimento",
    objetivo: "Emagrecimento",
    experiencia: "Qualquer",
    dias: "3x por semana",
    faixaEtaria: "Todas",
    descricao:
      "Circuito Full Body com cardio. Combina musculação e aeróbico para maximizar o gasto calórico.",
    tags: ["Circuito", "3 dias", "Cardio + Musculação"],
    cor: "#5b9cf6",
  },
  {
    id: 7,
    titulo: "Manutenção",
    objetivo: "Manutenção",
    experiencia: "Qualquer",
    dias: "3x por semana",
    faixaEtaria: "Todas",
    descricao:
      "Full Body moderado para manter o condicionamento atual. Volume equilibrado com cardio leve.",
    tags: ["Full Body", "3 dias", "Moderado"],
    cor: "#4caf7d",
  },
  {
    id: 8,
    titulo: "Força",
    objetivo: "Força",
    experiencia: "Intermediário",
    dias: "3–4x por semana",
    faixaEtaria: "18–60 anos",
    descricao:
      "Exercícios compostos com baixas repetições e alta carga. Foco em ganho de força máxima.",
    tags: ["Compostos", "3–4 dias", "Alta carga"],
    cor: "#e05555",
  },
];

// Lógica de recomendação baseada no perfil do usuário
function recomendarTreinos(usuario, resultados) {
  if (!usuario || !resultados) return [];

  const idadeNum = usuario.idade || calcularIdade(usuario.data_nascimento);
  const nivelAtividade = resultados.nivel_atividade || "Sedentario";
  const objetivo = resultados.objetivo || null;

  // Define faixa etária
  let faixa = "18–40 anos";
  if (idadeNum < 18) faixa = "14–17 anos";
  else if (idadeNum >= 60) faixa = "60+ anos";
  else if (idadeNum >= 40) faixa = "40–60 anos";

  // Define experiência pelo nível de atividade
  let experiencia = "Iniciante";
  if (["Moderado", "Intenso"].includes(nivelAtividade))
    experiencia = "Intermediário";
  if (nivelAtividade === "MuitoIntenso") experiencia = "Avançado";

  const recomendados = [];

  TREINOS.forEach((t) => {
    let score = 0;

    // Pontuação por faixa etária
    if (t.faixaEtaria === faixa || t.faixaEtaria === "Todas") score += 2;

    // Pontuação por experiência
    if (t.experiencia === experiencia || t.experiencia === "Qualquer")
      score += 2;

    // Pontuação por objetivo
    if (objetivo && t.objetivo.toLowerCase().includes(objetivo.toLowerCase()))
      score += 3;

    if (score >= 3) recomendados.push(t.id);
  });

  return recomendados;
}

function calcularIdade(dataNascimento) {
  if (!dataNascimento) return 25;
  const hoje = new Date();
  const nasc = new Date(dataNascimento);
  return hoje.getFullYear() - nasc.getFullYear();
}

export default function MeusTreinos() {
  const navigate = useNavigate();
  const usuarioSalvo = JSON.parse(localStorage.getItem("usuario") || "{}");
  const [filtroObjetivo, setFiltroObjetivo] = useState("Todos");
  const [treinosRecomendados, setTreinosRecomendados] = useState([]);

  // Proteção de rota
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, []);

  // Busca resultados do dashboard para recomendar treinos
  useEffect(() => {
    async function buscarResultados() {
      const token = localStorage.getItem("token");
      const idUsuario = usuarioSalvo.id;
      if (!idUsuario || !token) return;

      try {
        const response = await api.get("/treinos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
      } catch (error) {
        console.error(error.response?.data?.erro);
      }
    }
    buscarResultados();
  }, []);

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

  const treinosFiltrados = TREINOS.filter(
    (t) => filtroObjetivo === "Todos" || t.objetivo === filtroObjetivo,
  );

  // Separa recomendados dos demais
  const recomendados = treinosFiltrados.filter((t) =>
    treinosRecomendados.includes(t.id),
  );
  const demais = treinosFiltrados.filter(
    (t) => !treinosRecomendados.includes(t.id),
  );

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
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
          <Link to="#">Evolução</Link>
          <Link to="#">Configurações</Link>
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          Sair da Conta
        </button>
      </aside>

      {/* Conteúdo */}
      <main className="dashboard-content">
        <section className="welcome-section">
          <h1 className="welcome-title">
            Meus <span>Treinos</span>
          </h1>
          <p className="welcome-desc">
            Os treinos recomendados foram selecionados com base no seu perfil.
            Você também pode explorar todos os planos disponíveis.
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

        {/* Treinos Recomendados */}
        {recomendados.length > 0 && (
          <div className="treinos-secao">
            <div className="secao-header">
              <span className="secao-badge recomendado">
                ⭐ Recomendados para você
              </span>
            </div>
            <div className="treinos-grid">
              {recomendados.map((treino) => (
                <TreinoCard
                  key={treino.id}
                  treino={treino}
                  recomendado={true}
                  onClick={() => navigate(`/treino/${treino.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Todos os Treinos */}
        {demais.length > 0 && (
          <div className="treinos-secao">
            {recomendados.length > 0 && (
              <div className="secao-header">
                <span className="secao-badge">Todos os planos</span>
              </div>
            )}
            <div className="treinos-grid">
              {demais.map((treino) => (
                <TreinoCard
                  key={treino.id}
                  treino={treino}
                  recomendado={false}
                  onClick={() => navigate(`/treino/${treino.id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function TreinoCard({ treino, recomendado, onClick }) {
  return (
    <div
      className={`treino-card ${recomendado ? "recomendado" : ""}`}
      onClick={onClick}
      style={{ "--card-cor": treino.cor }}
    >
      <div className="treino-card-topo">
        <span className="treino-objetivo">{treino.objetivo}</span>
        {recomendado && <span className="badge-rec">⭐ Recomendado</span>}
      </div>

      <h3 className="treino-titulo">{treino.titulo}</h3>
      <p className="treino-desc">{treino.descricao}</p>

      <div className="treino-info">
        <span>📅 {treino.dias}</span>
        <span>👤 {treino.experiencia}</span>
        <span>🎯 {treino.faixaEtaria}</span>
      </div>

      <div className="treino-tags">
        {treino.tags.map((tag) => (
          <span key={tag} className="treino-tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="treino-card-footer">
        <span className="ver-treino">Ver treino →</span>
      </div>
    </div>
  );
}
