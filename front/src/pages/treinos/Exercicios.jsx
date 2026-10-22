import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DashboardNavbar from '../../components/layout/DashboardNavbar';
import { useFeedback } from '../../hooks/useFeedback';
import { SkeletonGrid } from '../../components/ui/Skeleton';
import api, { unwrap, getApiError } from '../../services/api';
import { isAdmin } from '../../services/auth';
import { GRUPOS_MUSCULARES } from '../../constants/dominio';
import '../../styles/dashboard.css';
import '../../styles/exercicios.css';

const EXERCICIO_VAZIO = { nome: '', grupo_muscular: 'Peito', descricao: '', caminho_video: '' };

const ITENS_POR_PAGINA = 9;

// Gera a lista de páginas a exibir, com "..." quando há muitas páginas.
const gerarListaPaginas = (atual, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const paginas = [1];
  const inicio = Math.max(2, atual - 1);
  const fim = Math.min(total - 1, atual + 1);

  if (inicio > 2) paginas.push('...');
  for (let i = inicio; i <= fim; i += 1) paginas.push(i);
  if (fim < total - 1) paginas.push('...');
  paginas.push(total);

  return paginas;
};

export default function Exercicios() {
  const eAdmin = isAdmin();
  const { toast, confirmar } = useFeedback();

  const [exercicios, setExercicios] = useState([]);
  const [carregado, setCarregado] = useState(false);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [grupoSelecionado, setGrupoSelecionado] = useState('Todos');
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [formExercicio, setFormExercicio] = useState(EXERCICIO_VAZIO);
  const [exercicioEmEdicao, setExercicioEmEdicao] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const gridRef = useRef(null);

  const editando = Boolean(exercicioEmEdicao);

  // Recarrega também após criar/editar/remover; `carregado` evita reexibir o spinner.
  const carregarExercicios = useCallback(async () => {
    try {
      const res = await api.get('/exercicios');
      setExercicios(unwrap(res));
      setErro('');
    } catch (err) {
      setErro(getApiError(err, 'Erro ao carregar exercícios. Tente novamente mais tarde.'));
      console.error(err);
    }
  }, []);

  useEffect(() => {
    let ativo = true;

    carregarExercicios().finally(() => {
      if (ativo) setCarregado(true);
    });

    return () => { ativo = false; };
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

  // Paginação (9 por página)
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / ITENS_POR_PAGINA));
  const paginaSegura = Math.min(paginaAtual, totalPaginas);
  const indiceInicio = (paginaSegura - 1) * ITENS_POR_PAGINA;
  const exerciciosPagina = filtrados.slice(indiceInicio, indiceInicio + ITENS_POR_PAGINA);
  const listaPaginas = gerarListaPaginas(paginaSegura, totalPaginas);

  // Volta à primeira página ao mudar a busca ou o filtro.
  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, grupoSelecionado]);

  // Corrige a página caso o último item dela seja removido.
  useEffect(() => {
    if (paginaAtual > totalPaginas) setPaginaAtual(totalPaginas);
  }, [paginaAtual, totalPaginas]);

  const irParaPagina = (pagina) => {
    setPaginaAtual(pagina);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const abrirCriar = () => {
    setExercicioEmEdicao(null);
    setFormExercicio(EXERCICIO_VAZIO);
    setModalAberto(true);
  };

  const abrirEditar = (exercicio) => {
    setExercicioEmEdicao(exercicio);
    setFormExercicio({
      nome: exercicio.nome || '',
      grupo_muscular: exercicio.grupo_muscular || 'Peito',
      descricao: exercicio.descricao || '',
      caminho_video: exercicio.caminho_video || '',
    });
    setModalAberto(true);
  };

  const fecharModal = () => {
    if (salvando) return;
    setModalAberto(false);
    setExercicioEmEdicao(null);
    setFormExercicio(EXERCICIO_VAZIO);
  };

  const submeterExercicio = async (event) => {
    event.preventDefault();
    const { nome, grupo_muscular, descricao, caminho_video } = formExercicio;
    const payload = {
      nome: nome.trim(),
      grupo_muscular,
      descricao: descricao.trim() || null,
      caminho_video: caminho_video.trim() || null,
    };

    try {
      setSalvando(true);

      if (editando) {
        const id = exercicioEmEdicao.id ?? exercicioEmEdicao.idExercicio;
        await api.put(`/exercicios/${id}`, payload);
      } else {
        await api.post('/exercicios', payload);
      }

      setModalAberto(false);
      setExercicioEmEdicao(null);
      setFormExercicio(EXERCICIO_VAZIO);
      toast.sucesso(editando ? 'Exercício atualizado com sucesso!' : 'Exercício criado com sucesso!');
      await carregarExercicios();
    } catch (err) {
      toast.erro(getApiError(
        err,
        editando ? 'Não foi possível editar o exercício.' : 'Não foi possível criar o exercício.',
      ));
    } finally {
      setSalvando(false);
    }
  };

  const removerExercicio = async (id) => {
    const confirmado = await confirmar({
      titulo: 'Remover exercício',
      mensagem: 'Tem certeza que deseja remover este exercício? Esta ação não pode ser desfeita.',
      textoConfirmar: 'Remover',
      perigoso: true,
    });
    if (!confirmado) return;

    try {
      await api.delete(`/exercicios/${id}`);
      await carregarExercicios();
      toast.sucesso('Exercício removido.');
    } catch (err) {
      toast.erro(getApiError(err, 'Não foi possível remover o exercício.'));
    }
  };

  const atualizarCampo = (event) => {
    const { name, value } = event.target;
    setFormExercicio((prev) => ({ ...prev, [name]: value }));
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
            <button className="criar-exercicio-btn" onClick={abrirCriar}>
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

        {loading && <SkeletonGrid itens={9} className="exercicios-grid" />}

        {!loading && !erro && filtrados.length === 0 && (
          <div className="exercicios-vazio">
            <p>Nenhum exercício encontrado para os critérios selecionados.</p>
          </div>
        )}

        {!loading && !erro && filtrados.length > 0 && (
          <>
            <div className="exercicios-grid" ref={gridRef}>
              {exerciciosPagina.map((exercicio) => {
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
                          <div className="card-acoes-admin">
                            <button
                              className="btn-editar-exercicio"
                              onClick={() => abrirEditar(exercicio)}
                              title="Editar exercício"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              className="btn-remover btn-remover-inline"
                              onClick={() => removerExercicio(id)}
                              title="Remover exercício"
                            >
                              🗑️ Remover
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="exercicios-footer">
              <p>
                Mostrando <strong>{indiceInicio + 1}</strong>–<strong>{indiceInicio + exerciciosPagina.length}</strong> de <strong>{filtrados.length}</strong> exercícios
              </p>
            </div>

            {totalPaginas > 1 && (
              <nav className="paginacao" aria-label="Paginação de exercícios">
                <button
                  type="button"
                  className="paginacao-btn paginacao-seta"
                  onClick={() => irParaPagina(paginaSegura - 1)}
                  disabled={paginaSegura === 1}
                >
                  ‹ Anterior
                </button>

                {listaPaginas.map((item, indice) => (
                  item === '...'
                    ? <span key={`reticencias-${indice}`} className="paginacao-reticencias">…</span>
                    : (
                      <button
                        key={item}
                        type="button"
                        className={`paginacao-btn${item === paginaSegura ? ' ativa' : ''}`}
                        aria-current={item === paginaSegura ? 'page' : undefined}
                        aria-label={`Ir para a página ${item}`}
                        onClick={() => irParaPagina(item)}
                      >
                        {item}
                      </button>
                    )
                ))}

                <button
                  type="button"
                  className="paginacao-btn paginacao-seta"
                  onClick={() => irParaPagina(paginaSegura + 1)}
                  disabled={paginaSegura === totalPaginas}
                >
                  Próxima ›
                </button>
              </nav>
            )}
          </>
        )}
      </main>

      {modalAberto && (
        <div className="modal-overlay" role="presentation" onMouseDown={fecharModal}>
          <div
            className="exercicio-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-exercicio-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="titulo-exercicio-modal">
                {editando ? 'Editar Exercício' : 'Criar Exercício Global'}
              </h2>
              <button type="button" className="modal-fechar" onClick={fecharModal} aria-label="Fechar">×</button>
            </div>

            <form className="exercicio-form" onSubmit={submeterExercicio}>
              <label>
                Nome do Exercício *
                <input type="text" name="nome" required value={formExercicio.nome} onChange={atualizarCampo} />
              </label>
              <label>
                Grupo Muscular
                <select name="grupo_muscular" value={formExercicio.grupo_muscular} onChange={atualizarCampo}>
                  {GRUPOS_MUSCULARES.map((grupo) => <option key={grupo}>{grupo}</option>)}
                </select>
              </label>
              <label>
                Descrição
                <textarea name="descricao" rows="4" value={formExercicio.descricao} onChange={atualizarCampo} />
              </label>
              <label>
                URL do Vídeo Demonstrativo
                <input type="url" name="caminho_video" value={formExercicio.caminho_video} onChange={atualizarCampo} />
              </label>

              <div className="modal-acoes">
                <button type="button" className="modal-cancelar" onClick={fecharModal} disabled={salvando}>
                  Cancelar
                </button>
                <button type="submit" className="criar-exercicio-btn" disabled={salvando}>
                  {salvando
                    ? (editando ? 'Salvando...' : 'Criando...')
                    : (editando ? 'Salvar Alterações' : 'Criar Exercício')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
