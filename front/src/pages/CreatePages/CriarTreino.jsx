import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../../components/DashboardNavbar';
import api from '../../services/api';
import '../../styles/dashboard.css';
import '../../styles/meustreinos.css';
import '../../styles/criarTreino.css';

export default function CriarTreino() {
  const navigate = useNavigate();

  // Estado do treino
  const [treino, setTreino] = useState({
    titulo: '',
    objetivo: 'Hipertrofia',
    descricao: '',
    is_oficial: true,
  });

  // Estado do catálogo e seleção
  const [exerciciosCatalogo, setExerciciosCatalogo] = useState([]);
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState([]);
  
  // Filtros
  const [busca, setBusca] = useState('');
  const [grupoSelecionado, setGrupoSelecionado] = useState('Todos');

  // Estados da UI
  const [loadingCatalogo, setLoadingCatalogo] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Grupos musculares disponíveis
  const grupos = [
    'Todos',
    'Peito',
    'Costas',
    'Ombros',
    'Braços',
    'Antebraços',
    'Coxas',
    'Pernas',
    'Glúteos',
    'Abdômen',
    'Cardio'
  ];

  const objetivos = [
    'Hipertrofia',
    'Emagrecimento',
    'Resistencia',
    'Condicionamento'
  ];

  // Buscar catálogo de exercícios
  useEffect(() => {
    const fetchExercicios = async () => {
      try {
        setLoadingCatalogo(true);
        const response = await api.get('/exercicios');
        setExerciciosCatalogo(response.data?.data || response.data || []);
      } catch (err) {
        console.error('Erro ao buscar exercícios:', err);
        setErro('Erro ao carregar o catálogo de exercícios.');
      } finally {
        setLoadingCatalogo(false);
      }
    };
    fetchExercicios();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const handleTreinoChange = (e) => {
    const { name, value } = e.target;
    setTreino(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filtragem do catálogo
  const exerciciosFiltrados = exerciciosCatalogo.filter(ex => {
    const matchBusca = ex.nome?.toLowerCase().includes(busca.toLowerCase());
    const matchGrupo = grupoSelecionado === 'Todos' || ex.grupo_muscular === grupoSelecionado;
    return matchBusca && matchGrupo;
  });

  // Toggle de seleção do exercício
  const toggleExercicio = (exercicio) => {
    const id = exercicio.id || exercicio.idExercicio;
    const selecionado = exerciciosSelecionados.find(e => e.idExercicio === id);
    
    if (selecionado) {
      setExerciciosSelecionados(prev => prev.filter(e => e.idExercicio !== id));
    } else {
      setExerciciosSelecionados(prev => [...prev, {
        idExercicio: id,
        nome: exercicio.nome,
        grupo_muscular: exercicio.grupo_muscular,
        caminho_video: exercicio.caminho_video,
        series: 3,
        repeticoes: 10,
        descanso_segundos: 60
      }]);
    }
  };

  // Atualizar valores de um exercício selecionado
  const updateExercicio = (idExercicio, field, value) => {
    setExerciciosSelecionados(prev => prev.map(e => 
      e.idExercicio === idExercicio ? { ...e, [field]: value } : e
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!treino.titulo.trim()) {
      setErro('Nome do treino é obrigatório.');
      window.scrollTo(0, 0);
      return;
    }

    if (exerciciosSelecionados.length === 0) {
      setErro('Selecione pelo menos um exercício.');
      window.scrollTo(0, 0);
      return;
    }

    try {
      setLoadingSubmit(true);
      setErro('');
      setSucesso('');

      // 1. Criar o treino
      const treinoResponse = await api.post('/treinos', {
        titulo: treino.titulo,
        objetivo: treino.objetivo,
        descricao: treino.descricao,
        is_oficial: true,
        nivel: 'Iniciante'
      });

      const idTreino = treinoResponse.data?.data?.idTreino || treinoResponse.data?.idTreino || treinoResponse.data?.id;

      if (!idTreino) throw new Error('ID do treino não retornado pela API');

      // 2. Adicionar exercícios ao treino
      const exerciciosPayload = exerciciosSelecionados.map(ex => ({
        nome: ex.nome,
        grupo_muscular: ex.grupo_muscular,
        caminho_video: ex.caminho_video || null,
        serie: ex.series,
        repeticoes: ex.repeticoes,
        descanso_segundos: ex.descanso_segundos,
        tipo: 'Força'
      }));

      await api.post(`/treinos/${idTreino}/exercicios`, exerciciosPayload);

      setSucesso('Treino global criado com sucesso!');
      
      setTimeout(() => {
        navigate('/meus-treinos');
      }, 2000);

    } catch (error) {
      console.error('Erro ao criar treino:', error);
      setErro(error.response?.data?.error || error.response?.data?.message || error.message || 'Erro ao criar treino');
      window.scrollTo(0, 0);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <>
      <DashboardNavbar onLogout={handleLogout} />
      <div className="dashboard-layout">
        <main className="dashboard-content">
          <section className="welcome-section">
            <h1 className="welcome-title">
              Criar <span>Treino Global</span>
            </h1>
            <p className="welcome-desc">
              Crie um novo treino selecionando exercícios do nosso catálogo.
            </p>
          </section>

          <form onSubmit={handleSubmit} className="criar-treino-form">
            {/* Mensagens de Feedback */}
            {erro && (
              <div className="feedback-message error">
                {erro}
              </div>
            )}
            {sucesso && (
              <div className="feedback-message success">
                {sucesso}
              </div>
            )}

            {/* SEÇÃO: Informações do Treino */}
            <div className="calc-card" style={{ marginBottom: '30px' }}>
              <h3>Informações do Treino</h3>
              
              <div className="input-group">
                <label htmlFor="titulo">Nome do Treino *</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  placeholder="Ex: Treino A - Peito e Tríceps"
                  value={treino.titulo}
                  onChange={handleTreinoChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="objetivo">Objetivo / Categoria *</label>
                <select
                  id="objetivo"
                  name="objetivo"
                  value={treino.objetivo}
                  onChange={handleTreinoChange}
                  required
                >
                  {objetivos.map(obj => (
                    <option key={obj} value={obj}>{obj}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="descricao">Descrição / Instruções</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Ex: Este treino é focado em ganho de massa muscular..."
                  value={treino.descricao}
                  onChange={handleTreinoChange}
                  rows={4}
                  className="textarea-custom"
                />
              </div>
            </div>

            {/* SEÇÃO: Catálogo de Exercícios */}
            <div className="calc-card" style={{ marginBottom: '30px' }}>
              <h3>Selecione os Exercícios</h3>
              <p style={{ color: 'var(--text-gray)', marginBottom: '20px' }}>
                Clique nos cards para selecionar os exercícios e definir suas séries e repetições.
              </p>

              {/* Filtros */}
              <div className="filtros-catalogo">
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="Buscar exercício..." 
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <select 
                    value={grupoSelecionado}
                    onChange={(e) => setGrupoSelecionado(e.target.value)}
                  >
                    {grupos.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lista de Exercícios */}
              {loadingCatalogo ? (
                <p>Carregando catálogo...</p>
              ) : (
                <div className="catalogo-grid">
                  {exerciciosFiltrados.length === 0 ? (
                    <p style={{ color: 'var(--text-gray)' }}>Nenhum exercício encontrado.</p>
                  ) : (
                    exerciciosFiltrados.map(exercicio => {
                      const id = exercicio.id || exercicio.idExercicio;
                      const selecionado = exerciciosSelecionados.find(e => e.idExercicio === id);
                      
                      return (
                        <div 
                          key={id} 
                          className={`catalogo-card ${selecionado ? 'selecionado' : ''}`}
                        >
                          {/* Cabeçalho do Card clicável para toggle */}
                          <div 
                            className="catalogo-card-header"
                            onClick={() => toggleExercicio(exercicio)}
                          >
                            <div className="catalogo-card-info">
                              <span className="badge-grupo">{exercicio.grupo_muscular}</span>
                              <h4>{exercicio.nome}</h4>
                              {exercicio.caminho_video && (
                                <a 
                                  href={exercicio.caminho_video} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="link-video"
                                >
                                  ▶ Ver vídeo
                                </a>
                              )}
                            </div>
                            
                            {/* Checkbox circular customizado */}
                            <div className="circle-checkbox">
                              {selecionado && <span className="check-icon">✓</span>}
                            </div>
                          </div>

                          {/* Formulário Interno (Visível apenas quando selecionado) */}
                          {selecionado && (
                            <div className="catalogo-card-form">
                              <div className="input-group-mini">
                                <label>Séries</label>
                                <input 
                                  type="number" 
                                  min="1" 
                                  value={selecionado.series}
                                  onChange={(e) => updateExercicio(id, 'series', parseInt(e.target.value) || 0)}
                                  required
                                />
                              </div>
                              <div className="input-group-mini">
                                <label>Repetições</label>
                                <input 
                                  type="number" 
                                  min="1" 
                                  value={selecionado.repeticoes}
                                  onChange={(e) => updateExercicio(id, 'repeticoes', parseInt(e.target.value) || 0)}
                                  required
                                />
                              </div>
                              <div className="input-group-mini">
                                <label>Descanso (s)</label>
                                <input 
                                  type="number" 
                                  min="0" 
                                  value={selecionado.descanso_segundos}
                                  onChange={(e) => updateExercicio(id, 'descanso_segundos', parseInt(e.target.value) || 0)}
                                  required
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>

            {/* Resumo da Seleção */}
            <div style={{ marginBottom: '20px', textAlign: 'right', color: 'var(--text-gray)' }}>
              <strong>{exerciciosSelecionados.length}</strong> exercício(s) selecionado(s)
            </div>

            {/* Botões de Ação */}
            <div className="action-buttons">
              <button
                type="button"
                onClick={() => navigate('/meus-treinos')}
                className="btn-cancel"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loadingSubmit}
                className="btn-calc"
                style={{
                  cursor: loadingSubmit ? 'not-allowed' : 'pointer',
                  opacity: loadingSubmit ? 0.6 : 1
                }}
              >
                {loadingSubmit ? 'Salvando...' : 'Salvar Treino Global'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
