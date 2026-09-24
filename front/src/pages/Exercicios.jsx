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
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [remover, setRemover] = useState(false);
  const [novoExercicio, setNovoExercicio] = useState({ nome: '', grupo_muscular: 'Peito', descricao: '', caminho_video: '' });
  const usuario = (() => {
    try { return JSON.parse(localStorage.getItem('usuario') || 'null'); } catch { return null; }
  })();
  const eAdmin = usuario?.role === 'ADMIN';

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
        setExercicios(response.data?.data || response.data || []);
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

  const fecharModal = () => {
    if (!salvando) {
      setModalAberto(false);
      setNovoExercicio({ nome: '', grupo_muscular: 'Peito', descricao: '', caminho_video: '' });
    }
  };

  const criarExercicio = async (event) => {
    event.preventDefault();
    try {
      setSalvando(true);
      await api.post('/exercicios', {
        nome: novoExercicio.nome.trim(),
        grupo_muscular: novoExercicio.grupo_muscular,
        descricao: novoExercicio.descricao.trim() || null,
        caminho_video: novoExercicio.caminho_video.trim() || null
      });
      window.alert('Exercício global criado com sucesso.');
      setModalAberto(false);
      setNovoExercicio({ nome: '', grupo_muscular: 'Peito', descricao: '', caminho_video: '' });
      const response = await api.get('/exercicios');
      setExercicios(response.data?.data || response.data || []);
    } catch (err) {
      window.alert(err.response?.data?.erro || err.response?.data?.error || err.response?.data?.message || 'Não foi possível criar o exercício.');
    } finally {
      setSalvando(false);
    }
  };

  const removerExercicio = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este exercício?')) return;
    try {
      await api.delete(`/exercicios/${id}`);
      window.alert('Exercício removido com sucesso.');
      const response = await api.get('/exercicios');
      setExercicios(response.data?.data || response.data || []);
    } catch (err) {
      window.alert(err.response?.data?.erro || err.response?.data?.error || err.response?.data?.message || 'Não foi possível remover o exercício.');
    }
  };

  return (
    <div className="dashboard-layout">
      <DashboardNavbar />
      
      <main className="exercicios-container">
        <div className="exercicios-header">
          <div>
            <h1>Exercícios</h1>
            <p className="exercicios-subtitle">
              Explore nossa biblioteca completa de exercícios por grupo muscular
            </p>
          </div>
          {eAdmin && (
            <button className="criar-exercicio-btn" onClick={() => setModalAberto(true)}>
              + Criar Exercício Global
            </button>
          )}
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
              <div key={exercicio.id || exercicio.idExercicio} className="exercicio-card">
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

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                    {/* Botão de Vídeo */}
                    {exercicio.caminho_video ? (
                      <button
                        className="card-video-btn"
                        onClick={() => abrirVideo(exercicio.caminho_video)}
                        title="Abrir vídeo demonstrativo"
                        style={{ width: '100%' }}
                      >
                        ▶ Assista a Demonstração
                      </button>
                    ) : (
                      <p className="card-sem-video" style={{ textAlign: 'center', padding: '10px', margin: '0' }}>Sem vídeo disponível</p>
                    )}

                    {/* Botão de Remover */}
                    {eAdmin && (
                      <button
                        onClick={() => removerExercicio(exercicio.id || exercicio.idExercicio)}
                        title="Remover exercício"
                        style={{ 
                          width: '100%', 
                          padding: '10px 16px', 
                          backgroundColor: '#ff4d4f', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '8px', 
                          fontWeight: 'bold', 
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#ff7875'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#ff4d4f'}
                      >
                        🗑️ Remover
                      </button>
                    )}
                  </div>
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
      {modalAberto && (
        <div className="modal-overlay" role="presentation" onMouseDown={fecharModal}>
          <div className="exercicio-modal" role="dialog" aria-modal="true" aria-labelledby="titulo-criar-exercicio" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2 id="titulo-criar-exercicio">Criar Exercício Global</h2>
              <button type="button" className="modal-fechar" onClick={fecharModal} aria-label="Fechar">×</button>
            </div>
            <form className="exercicio-form" onSubmit={criarExercicio}>
              <label>Nome do Exercício *
                <input type="text" required value={novoExercicio.nome} onChange={(event) => setNovoExercicio({ ...novoExercicio, nome: event.target.value })} />
              </label>
              <label>Grupo Muscular
                <select value={novoExercicio.grupo_muscular} onChange={(event) => setNovoExercicio({ ...novoExercicio, grupo_muscular: event.target.value })}>
                  {grupos.filter((grupo) => grupo !== 'Todos').map((grupo) => <option key={grupo} value={grupo}>{grupo}</option>)}
                </select>
              </label>
              <label>Descrição
                <textarea rows="4" value={novoExercicio.descricao} onChange={(event) => setNovoExercicio({ ...novoExercicio, descricao: event.target.value })} />
              </label>
              <label>URL do Vídeo Demonstrativo
                <input type="url" value={novoExercicio.caminho_video} onChange={(event) => setNovoExercicio({ ...novoExercicio, caminho_video: event.target.value })} />
              </label>
              <div className="modal-acoes">
                <button type="button" className="modal-cancelar" onClick={fecharModal} disabled={salvando}>Cancelar</button>
                <button type="submit" className="criar-exercicio-btn" disabled={salvando}>{salvando ? 'Criando...' : 'Criar Exercício'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
