import React, { useState, useEffect } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import api from '../services/api';
import '../styles/exercicios.css';

export default function Exercicios() {
  const [exercicios, setExercicios] = useState([]);
  const [exerciciosFiltrados, setExerciciosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [grupoSelecionado, setGrupoSelecionado] = useState('Todos');

  const grupos = [
    'Todos',
    'Peito',
    'Costa',
    'Ombro',
    'Braço',
    'Antebraço',
    'Coxa',
    'Perna',
    'Glúteos',
    'Abdomen',
    'Cardio'
  ];

  // Buscar exercícios da API
  useEffect(() => {
    const buscarExercicios = async () => {
      try {
        setLoading(true);
        const response = await api.get('/exercicios');
        setExercicios(response.data || []);
        setErro('');
      } catch (err) {
        setErro('Erro ao carregar exercícios. Tente novamente mais tarde.');
        console.error('Erro ao buscar exercícios:', err);
        setExercicios([]);
      } finally {
        setLoading(false);
      }
    };

    buscarExercicios();
  }, []);

  // Filtrar exercícios por nome e grupo muscular
  useEffect(() => {
    let resultado = exercicios;

    // Filtro por busca (nome)
    if (busca.trim()) {
      resultado = resultado.filter(exercicio =>
        exercicio.nome?.toLowerCase().includes(busca.toLowerCase())
      );
    }

    // Filtro por grupo muscular
    if (grupoSelecionado !== 'Todos') {
      resultado = resultado.filter(
        exercicio => exercicio.grupo_muscular === grupoSelecionado
      );
    }

    setExerciciosFiltrados(resultado);
  }, [exercicios, busca, grupoSelecionado]);

  const abrirVideo = (caminhoVideo) => {
    if (caminhoVideo) {
      window.open(caminhoVideo, '_blank');
    }
  };

  return (
    <div className="dashboard-layout">
      <DashboardNavbar />
      
      <main className="exercicios-container">
        <div className="exercicios-header">
          <h1>Exercícios</h1>
          <p className="exercicios-subtitle">
            Explore nossa biblioteca completa de exercícios por grupo muscular
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="exercicios-controls">
          {/* Campo de Busca */}
          <div className="busca-wrapper">
            <input
              type="text"
              placeholder="Buscar exercício por nome..."
              className="input-busca"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          {/* Seletor de Grupo Muscular */}
          <div className="filtro-wrapper">
            <label htmlFor="grupo-muscular" className="filtro-label">
              Grupo Muscular:
            </label>
            <select
              id="grupo-muscular"
              className="filtro-select"
              value={grupoSelecionado}
              onChange={(e) => setGrupoSelecionado(e.target.value)}
            >
              {grupos.map(grupo => (
                <option key={grupo} value={grupo}>
                  {grupo}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mensagens de Estado */}
        {erro && (
          <div className="exercicios-erro">
            <p>{erro}</p>
          </div>
        )}

        {loading && (
          <div className="exercicios-loading">
            <div className="spinner"></div>
            <p>Carregando exercícios...</p>
          </div>
        )}

        {!loading && !erro && exerciciosFiltrados.length === 0 && (
          <div className="exercicios-vazio">
            <p>Nenhum exercício encontrado para os critérios selecionados.</p>
          </div>
        )}

        {/* Grid de Cards */}
        {!loading && !erro && exerciciosFiltrados.length > 0 && (
          <div className="exercicios-grid">
            {exerciciosFiltrados.map(exercicio => (
              <div key={exercicio.id} className="exercicio-card">
                {/* Badge do Grupo Muscular */}
                <div className="card-badge">
                  {exercicio.grupo_muscular}
                </div>

                {/* Conteúdo do Card */}
                <div className="card-content">
                  <h3 className="card-titulo">{exercicio.nome}</h3>
                  
                  {exercicio.descricao && (
                    <p className="card-descricao">
                      {exercicio.descricao}
                    </p>
                  )}

                  {/* Botão de Vídeo */}
                  {exercicio.caminho_video && (
                    <button
                      className="card-video-btn"
                      onClick={() => abrirVideo(exercicio.caminho_video)}
                      title="Abrir vídeo demonstrativo"
                    >
                      ▶ Assista a Demonstração
                    </button>
                  )}

                  {!exercicio.caminho_video && (
                    <p className="card-sem-video">Sem vídeo disponível</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contagem de Resultados */}
        {!loading && !erro && exerciciosFiltrados.length > 0 && (
          <div className="exercicios-footer">
            <p>
              Mostrando <strong>{exerciciosFiltrados.length}</strong> de{' '}
              <strong>{exercicios.length}</strong> exercícios
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
