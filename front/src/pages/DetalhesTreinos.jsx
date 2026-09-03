import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import ExercicioItem from '../components/ExercicioItem';
import '../styles/dashboard.css';
import '../styles/meustreinos.css';
import '../styles/detalhestreinos.css';

export default function DetalhesTreino() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [treino, setTreino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregarDetalhesTreino() {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        // Busca os dados do treino e seus exercícios direto do Back-end
        const response = await api.get(`/treinos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTreino(response.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes do treino no banco:", err);
        setErro(true);
      } finally {
        setLoading(false);
      }
    }

    carregarDetalhesTreino();
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <main className="dashboard-content" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <h2>Carregando detalhes do treino...</h2>
        </main>
      </div>
    );
  }

  if (erro || !treino) {
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
            <Link to="/meus-treinos" className="active">Meus Treinos</Link>
            <Link to="/evolucao">Evolução</Link>
            <Link to="#">Configurações</Link>
          </nav>
          <button onClick={handleLogout} className="logout-btn">Sair da Conta</button>
        </aside>
        <main className="dashboard-content">
          <div className="treino-nao-encontrado">
            <h2>Treino não encontrado no banco de dados</h2>
            <button className="btn-voltar" onClick={() => navigate('/meus-treinos')}>
              ← Voltar para Meus Treinos
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Identifica se os exercícios vêm como relação direta (treinoExercicios) ou em divisões (divisao)
  const listaExercicios = treino.treinoExercicios || treino.exercicios || [];
  const temDivisoes = Array.isArray(treino.divisao) && treino.divisao.length > 0;

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
          <Link to="/meus-treinos" className="active">Meus Treinos</Link>
          <Link to="/evolucao">Evolução</Link>
          <Link to="#">Configurações</Link>
        </nav>
        <button onClick={handleLogout} className="logout-btn">Sair da Conta</button>
      </aside>

      <main className="dashboard-content">
        <button className="btn-voltar" onClick={() => navigate('/meus-treinos')}>
          ← Voltar para Meus Treinos
        </button>

        {/* Header do treino */}
        <div className="detalhe-header">
          <span className="detalhe-objetivo">{treino.objetivo || 'Treino'} - Nível: {treino.nivel || 'Não especificado'}</span>
          <h1 className="welcome-title" style={{ marginBottom: '0.5rem' }}>
            {treino.titulo || `Treino ${treino.objetivo}`}
          </h1>
          <p className="welcome-desc">{treino.descricao || 'Treino personalizado baseado em seu perfil'}</p>

          <div className="detalhe-meta">
            <span> Objetivo: {treino.objetivo}</span>
            {treino.data_criacao && <span> Criado em: {new Date(treino.data_criacao).toLocaleDateString('pt-BR')}</span>}
            <span> Total de Exercícios: {listaExercicios.length}</span>
          </div>
        </div>

        {/* Renderização com Divisão (ex: Treino A, Treino B) */}
        {temDivisoes ? (
          treino.divisao.map((dia, diaIdx) => (
            <div key={diaIdx} className="detalhe-card">
              <h3 className="detalhe-card-titulo">{dia.nome}</h3>
              <div className="exercicios-lista">
                {dia.exercicios?.map((ex, exIdx) => (
                  <ExercicioItem 
                    key={ex.id || exIdx} 
                    exercicio={ex} 
                    numero={exIdx + 1} 
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          /* Renderização Lista Direta de Exercícios da API */
          <div className="detalhe-card">
            <h3 className="detalhe-card-titulo">Exercícios do Treino</h3>
            {listaExercicios.length > 0 ? (
              <div className="exercicios-lista">
                {listaExercicios.map((ex, exIdx) => (
                  <ExercicioItem 
                    key={ex.id || exIdx} 
                    exercicio={ex} 
                    numero={exIdx + 1} 
                  />
                ))}
              </div>
            ) : (
              <p className="texto-vazio">Nenhum exercício cadastrado para este treino.</p>
            )}
          </div>
        )}

        <p className="aviso-legal">
          ⚠️ Este treino é uma recomendação inicial baseada no seu perfil. Consulte um profissional de educação física para acompanhamento personalizado.
        </p>
      </main>
    </div>
  );
}