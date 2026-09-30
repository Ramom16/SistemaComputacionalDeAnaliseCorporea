import { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import api, { unwrap, getApiError } from '../services/api';
import { isAdmin } from '../services/auth';
import { GRUPOS_MUSCULARES } from '../constants/dominio';
import '../styles/dashboard.css';
import '../styles/exercicios.css';

const EXERCICIO_VAZIO = { nome: '', grupo_muscular: 'Peito', descricao: '', caminho_video: '' };

export default function Exercicios() {
  const eAdmin = isAdmin();

  const [exercicios, setExercicios] = useState([]);
  const [carregado, setCarregado] = useState(false);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [grupoSelecionado, setGrupoSelecionado] = useState('Todos');
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [novoExercicio, setNovoExercicio] = useState(EXERCICIO_VAZIO);

  // Recarrega também após criar/remover; `carregado` evita reexibir o spinner.
  const carregarExercicios = useCallback(async () => {
    const res = await api.get('/exercicios');
    setExercicios(unwrap(res));
    setErro('');
  }, []);

  useEffect(() => {
    carregarExercicios()
      .catch((err) => {
        setErro(getApiError(err, 'Erro ao carregar exercícios. Tente novamente mais tarde.'));
        console.error(err);
      })
      .finally(() => setCarregado(true));
  }, [carregarExercicios]);

  const loading = !carregado;

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return exercicios.filter((exercicio) => {
      const bateBusca = !termo || exercicio.nome?.toLowerCase().includes(termo);
      const bateGrupo = grupoSelecionado === 'Todos' || exercicio.grupo_muscular === grupoSelecionado;
      return bateBusca && bateGrupo;
    });
  }, [exercicios, busca, grupoSelecionado]);

  const fecharModal = () => {
    if (salvando) return;
    setModalAberto(false);
    setNovoExercicio(EXERCICIO_VAZIO);
  };

  const criarExercicio = async (event) => {
    event.preventDefault();
    const { nome, grupo_muscular, descricao, caminho_video } = novoExercicio;

    try {
      setSalvando(true);
      await api.post('/exercicios', {
        nome: nome.trim(),
        grupo_muscular,
        descricao: descricao.trim() || null,
        caminho_video: caminho_video.trim() || null,
      });
      setModalAberto(false);
      setNovoExercicio(EXERCICIO_VAZIO);
      await carregarExercicios();
    } catch (err) {
      window.alert(getApiError(err, 'Não foi possível criar o exercício.'));
    } finally {
      setSalvando(false);
    }
  };

  const removerExercicio = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este exercício?')) return;

    try {
      await api.delete(`/exercicios/${id}`);
      await carregarExercicios();
    } catch (err) {
      window.alert(getApiError(err, 'Não foi possível remover o exercício.'));
    }
  };

  const atualizarCampo = (event) => {
    const { name, value } = event.target;
    setNovoExercicio((prev) => ({ ...prev, [name]: value }));
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

        <div className="exercicios-controls">
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

          <div className="filtro-wrapper">
            <label htmlFor="grupo-muscular" className="filtro-label">Grupo Muscular:</label>
            <select
              id="grupo-muscular"
              className="filtro-select"
              value={grupoSelecionado}
              onChange={(e) => setGrupoSelecionado(e.target.value)}
            >
              <option value="Todos">Todos</option>
              {GRUPOS_MUSCULARES.map((grupo) => <option key={grupo}>{grupo}</option>)}
            </select>
          </div>
        </div>

        {erro && <div className="exercicios-erro"><p>{erro}</p></div>}

        {loading && (
          <div className="exercicios-loading">
            <div className="spinner"></div>
            <p>Carregando exercícios...</p>
          </div>
        )}

        {!loading && !erro && filtrados.length === 0 && (
          <div className="exercicios-vazio">
            <p>Nenhum exercício encontrado para os critérios selecionados.</p>
          </div>
        )}

        {!loading && !erro && filtrados.length > 0 && (
          <>
            <div className="exercicios-grid">
              {filtrados.map((exercicio) => {
                const id = exercicio.id ?? exercicio.idExercicio;
                return (
                  <div key={id} className="exercicio-card">
                    <div className="card-badge">{exercicio.grupo_muscular}</div>

                    <div className="card-content">
                      <h3 className="card-titulo">{exercicio.nome}</h3>
                      {exercicio.descricao && <p className="card-descricao">{exercicio.descricao}</p>}

                      <div className="card-acoes">
                        {exercicio.caminho_video ? (
                          <a
                            className="card-video-btn"
                            href={exercicio.caminho_video}
                            target="_blank"
                            rel="noreferrer"
                          >
                            ▶ Assista a Demonstração
                          </a>
                        ) : (
                          <p className="card-sem-video">Sem vídeo disponível</p>
                        )}

                        {eAdmin && (
                          <button
                            className="btn-remover"
                            onClick={() => removerExercicio(id)}
                            title="Remover exercício"
                          >
                            🗑️ Remover
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="exercicios-footer">
              <p>
                Mostrando <strong>{filtrados.length}</strong> de <strong>{exercicios.length}</strong> exercícios
              </p>
            </div>
          </>
        )}
      </main>

      {modalAberto && (
        <div className="modal-overlay" role="presentation" onMouseDown={fecharModal}>
          <div
            className="exercicio-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-criar-exercicio"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="titulo-criar-exercicio">Criar Exercício Global</h2>
              <button type="button" className="modal-fechar" onClick={fecharModal} aria-label="Fechar">×</button>
            </div>

            <form className="exercicio-form" onSubmit={criarExercicio}>
              <label>
                Nome do Exercício *
                <input type="text" name="nome" required value={novoExercicio.nome} onChange={atualizarCampo} />
              </label>
              <label>
                Grupo Muscular
                <select name="grupo_muscular" value={novoExercicio.grupo_muscular} onChange={atualizarCampo}>
                  {GRUPOS_MUSCULARES.map((grupo) => <option key={grupo}>{grupo}</option>)}
                </select>
              </label>
              <label>
                Descrição
                <textarea name="descricao" rows="4" value={novoExercicio.descricao} onChange={atualizarCampo} />
              </label>
              <label>
                URL do Vídeo Demonstrativo
                <input type="url" name="caminho_video" value={novoExercicio.caminho_video} onChange={atualizarCampo} />
              </label>

              <div className="modal-acoes">
                <button type="button" className="modal-cancelar" onClick={fecharModal} disabled={salvando}>
                  Cancelar
                </button>
                <button type="submit" className="criar-exercicio-btn" disabled={salvando}>
                  {salvando ? 'Criando...' : 'Criar Exercício'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
