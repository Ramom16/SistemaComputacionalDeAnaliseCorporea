import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import api, { unwrap, getApiError } from '../services/api';
import { getUsuario, isAdmin } from '../services/auth';
import { OBJETIVOS_TREINO } from '../constants/dominio';
import '../styles/dashboard.css';
import '../styles/meustreinos.css';

const CORES_POR_OBJETIVO = {
  Hipertrofia: '#FF6B6B',
  Emagrecimento: '#4ECDC4',
  Resistencia: '#FFD93D',
  Condicionamento: '#6BCB77',
};

function TreinoCard({ treino, onRemove, eAdmin }) {
  const id = treino.idTreino ?? treino.id;
  const nivel = treino.nivel || 'Iniciante';

  return (
    <article className="treino-card" style={{ '--card-cor': CORES_POR_OBJETIVO[treino.objetivo] || '#f5c300' }}>
      <div className="treino-card-topo">
        <span className="treino-objetivo">{treino.objetivo || 'Geral'}</span>
        <span className="treino-nivel">Nível: {nivel}</span>
      </div>

      <h3 className="treino-titulo">{treino.titulo || `Treino ${treino.objetivo}`}</h3>
      <p className="treino-desc">{treino.descricao || 'Treino personalizado para seu perfil'}</p>

      <div className="treino-info">
        {treino.treinoExercicios && <span>💪 {treino.treinoExercicios.length} exercícios</span>}
        {treino.data_criacao && <span>📅 {new Date(treino.data_criacao).toLocaleDateString('pt-BR')}</span>}
      </div>

      <div className="treino-card-footer">
        <Link className="ver-treino" to={`/treino/${id}`}>Ver treino e exercícios →</Link>
        {eAdmin && (
          <button className="btn-remover btn-remover-inline" onClick={() => onRemove(id)} title="Remover treino">
            🗑️ Remover
          </button>
        )}
      </div>
    </article>
  );
}

export default function MeusTreinos() {
  const navigate = useNavigate();
  const usuario = getUsuario();
  const eAdmin = isAdmin();

  const [treinos, setTreinos] = useState([]);
  const [filtroObjetivo, setFiltroObjetivo] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get('/treinos')
      .then((res) => setTreinos(unwrap(res)))
      .catch((err) => {
        console.error('Erro ao carregar treinos da API:', err);
        setErro('Não foi possível carregar os treinos no momento. Tente novamente mais tarde.');
      })
      .finally(() => setLoading(false));
  }, []);

  const removerTreino = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este treino?')) return;

    try {
      await api.delete(`/treinos/${id}`);
      setTreinos((prev) => prev.filter((t) => (t.idTreino ?? t.id) !== id));
    } catch (err) {
      window.alert(getApiError(err, 'Não foi possível remover o treino.'));
    }
  };

  const filtrados = filtroObjetivo === 'Todos'
    ? treinos
    : treinos.filter((t) => t.objetivo === filtroObjetivo);

  return (
    <>
      <DashboardNavbar />
      <div className="dashboard-layout">
        <main className="dashboard-content">
          <div className="sugestoes-header">
            <div>
              <h1 className="welcome-title">Meus <span>Treinos</span></h1>
              <p className="welcome-desc">
                {usuario.nome
                  ? `Explore os planos de treino personalizados para você, ${usuario.nome}.`
                  : 'Explore os planos de treino disponíveis no sistema para o seu perfil.'}
              </p>
            </div>

            {eAdmin && (
              <button className="btn-criar-treino" onClick={() => navigate('/admin/criar-treino')}>
                + Criar Treino Global
              </button>
            )}
          </div>

          <div className="treinos-filtros">
            {['Todos', ...OBJETIVOS_TREINO].map((objetivo) => (
              <button
                key={objetivo}
                className={`filtro-btn ${filtroObjetivo === objetivo ? 'active' : ''}`}
                onClick={() => setFiltroObjetivo(objetivo)}
              >
                {objetivo}
              </button>
            ))}
          </div>

          {loading && <p className="loading-txt">Carregando treinos personalizados da API...</p>}
          {erro && <p className="erro-txt">{erro}</p>}

          {!loading && !erro && filtrados.length === 0 && (
            <p className="vazio-txt">
              Nenhum treino encontrado para o filtro "{filtroObjetivo}". Tente selecionar outro objetivo!
            </p>
          )}

          {!loading && !erro && filtrados.length > 0 && (
            <div className="treinos-grid">
              {filtrados.map((treino) => (
                <TreinoCard
                  key={treino.idTreino ?? treino.id}
                  treino={treino}
                  onRemove={removerTreino}
                  eAdmin={eAdmin}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
