import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../../components/DashboardNavbar';
import api, { unwrap, getApiError } from '../../services/api';
import { GRUPOS_MUSCULARES, OBJETIVOS_TREINO } from '../../constants/dominio';
import '../../styles/dashboard.css';
import '../../styles/meustreinos.css';
import '../../styles/criarTreino.css';

const TREINO_VAZIO = { titulo: '', objetivo: 'Hipertrofia', descricao: '' };

const EXERCICIO_SELECIONADO = { series: 3, repeticoes: 10, descanso_segundos: 60 };

export default function CriarTreino() {
  const navigate = useNavigate();

  const [treino, setTreino] = useState(TREINO_VAZIO);
  const [catalogo, setCatalogo] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [busca, setBusca] = useState('');
  const [grupoSelecionado, setGrupoSelecionado] = useState('Todos');
  const [loadingCatalogo, setLoadingCatalogo] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get('/exercicios')
      .then((res) => setCatalogo(unwrap(res)))
      .catch((err) => {
        console.error('Erro ao buscar exercícios:', err);
        setErro(getApiError(err, 'Erro ao carregar o catálogo de exercícios.'));
      })
      .finally(() => setLoadingCatalogo(false));
  }, []);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return catalogo.filter((ex) => {
      const bateBusca = !termo || ex.nome?.toLowerCase().includes(termo);
      const bateGrupo = grupoSelecionado === 'Todos' || ex.grupo_muscular === grupoSelecionado;
      return bateBusca && bateGrupo;
    });
  }, [catalogo, busca, grupoSelecionado]);

  const idsSelecionados = useMemo(
    () => new Set(selecionados.map((e) => e.idExercicio)),
    [selecionados],
  );

  const toggleExercicio = (exercicio) => {
    const idExercicio = exercicio.id ?? exercicio.idExercicio;

    setSelecionados((prev) => prev.some((e) => e.idExercicio === idExercicio)
      ? prev.filter((e) => e.idExercicio !== idExercicio)
      : [...prev, {
        idExercicio,
        nome: exercicio.nome,
        grupo_muscular: exercicio.grupo_muscular,
        caminho_video: exercicio.caminho_video,
        ...EXERCICIO_SELECIONADO,
      }]);
  };

  const atualizarExercicio = (idExercicio, field, value) => {
    setSelecionados((prev) => prev.map(
      (e) => (e.idExercicio === idExercicio ? { ...e, [field]: value } : e),
    ));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!treino.titulo.trim()) {
      setErro('Nome do treino é obrigatório.');
      window.scrollTo(0, 0);
      return;
    }

    if (selecionados.length === 0) {
      setErro('Selecione pelo menos um exercício.');
      window.scrollTo(0, 0);
      return;
    }

    try {
      setEnviando(true);
      setErro('');

      const { data } = await api.post('/treinos', { ...treino, is_oficial: true, nivel: 'Iniciante' });
      const idTreino = data?.data?.idTreino ?? data?.idTreino ?? data?.id;

      if (!idTreino) throw new Error('ID do treino não retornado pela API');

      await api.post(`/treinos/${idTreino}/exercicios`, selecionados.map((ex) => ({
        nome: ex.nome,
        grupo_muscular: ex.grupo_muscular,
        caminho_video: ex.caminho_video || null,
        serie: ex.series,
        repeticoes: ex.repeticoes,
        descanso_segundos: ex.descanso_segundos,
        tipo: 'Forca',
      })));

      navigate('/meus-treinos');
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      setErro(getApiError(error, 'Erro ao criar treino'));
      window.scrollTo(0, 0);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <DashboardNavbar />
      <div className="dashboard-layout">
        <main className="dashboard-content">
          <section className="welcome-section">
            <h1 className="welcome-title">Criar <span>Treino Global</span></h1>
            <p className="welcome-desc">Crie um novo treino selecionando exercícios do nosso catálogo.</p>
          </section>

          <form onSubmit={handleSubmit} className="criar-treino-form">
            {erro && <div className="feedback-message error">{erro}</div>}

            <div className="calc-card" style={{ marginBottom: '30px' }}>
              <h3>Informações do Treino</h3>

              <div className="input-group">
                <label htmlFor="titulo">Nome do Treino *</label>
                <input
                  type="text"
                  id="titulo"
                  placeholder="Ex: Treino A - Peito e Tríceps"
                  value={treino.titulo}
                  onChange={(e) => setTreino((prev) => ({ ...prev, titulo: e.target.value }))}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="objetivo">Objetivo / Categoria *</label>
                <select
                  id="objetivo"
                  value={treino.objetivo}
                  onChange={(e) => setTreino((prev) => ({ ...prev, objetivo: e.target.value }))}
                  required
                >
                  {OBJETIVOS_TREINO.map((objetivo) => <option key={objetivo}>{objetivo}</option>)}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="descricao">Descrição / Instruções</label>
                <textarea
                  id="descricao"
                  placeholder="Ex: Este treino é focado em ganho de massa muscular..."
                  value={treino.descricao}
                  onChange={(e) => setTreino((prev) => ({ ...prev, descricao: e.target.value }))}
                  rows={4}
                  className="textarea-custom"
                />
              </div>
            </div>

            <div className="calc-card" style={{ marginBottom: '30px' }}>
              <h3>Selecione os Exercícios</h3>
              <p style={{ color: 'var(--text-gray)', marginBottom: '20px' }}>
                Clique nos cards para selecionar os exercícios e definir suas séries e repetições.
              </p>

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
                  <select value={grupoSelecionado} onChange={(e) => setGrupoSelecionado(e.target.value)}>
                    <option value="Todos">Todos</option>
                    {GRUPOS_MUSCULARES.map((grupo) => <option key={grupo}>{grupo}</option>)}
                  </select>
                </div>
              </div>

              {loadingCatalogo ? (
                <p>Carregando catálogo...</p>
              ) : filtrados.length === 0 ? (
                <p style={{ color: 'var(--text-gray)' }}>Nenhum exercício encontrado.</p>
              ) : (
                <div className="catalogo-grid">
                  {filtrados.map((exercicio) => {
                    const id = exercicio.id ?? exercicio.idExercicio;
                    const selecionado = idsSelecionados.has(id) ? selecionados.find(
                      (e) => e.idExercicio === id,
                    ) : null;

                    return (
                      <div key={id} className={`catalogo-card ${selecionado ? 'selecionado' : ''}`}>
                        <div
                          className="catalogo-card-header"
                          onClick={() => toggleExercicio(exercicio)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && toggleExercicio(exercicio)}
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

                          <div className="circle-checkbox">
                            {selecionado && <span className="check-icon">✓</span>}
                          </div>
                        </div>

                        {selecionado && (
                          <div className="catalogo-card-form">
                            {[
                              ['series', 'Séries', 1],
                              ['repeticoes', 'Repetições', 1],
                              ['descanso_segundos', 'Descanso (s)', 0],
                            ].map(([field, rotulo, min]) => (
                              <div className="input-group-mini" key={field}>
                                <label htmlFor={`${field}-${id}`}>{rotulo}</label>
                                <input
                                  id={`${field}-${id}`}
                                  type="number"
                                  min={min}
                                  value={selecionado[field]}
                                  onChange={(e) => atualizarExercicio(id, field, parseInt(e.target.value, 10) || 0)}
                                  required
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px', textAlign: 'right', color: 'var(--text-gray)' }}>
              <strong>{selecionados.length}</strong> exercício(s) selecionado(s)
            </div>

            <div className="action-buttons">
              <button type="button" onClick={() => navigate('/meus-treinos')} className="btn-cancel">
                Cancelar
              </button>
              <button type="submit" className="btn-calc" disabled={enviando}>
                {enviando ? 'Salvando...' : 'Salvar Treino Global'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
