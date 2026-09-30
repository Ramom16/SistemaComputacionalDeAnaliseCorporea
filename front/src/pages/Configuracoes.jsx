import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import api, { unwrap, getApiError } from '../services/api';
import { getUsuario, limparSessao, isAdmin } from '../services/auth';
import '../styles/dashboard.css';

export default function Configuracoes() {
  const navigate = useNavigate();
  const usuario = getUsuario();
  const admin = isAdmin();

  const [usuariosList, setUsuariosList] = useState([]);
  const [carregado, setCarregado] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!admin) return;

    let ativo = true;

    api.get('/usuarios')
      .then((res) => { if (ativo) setUsuariosList(unwrap(res)); })
      .catch((err) => {
        if (!ativo) return;
        console.error(err);
        setErro(getApiError(err, 'Não foi possível carregar a lista de usuários.'));
      })
      .finally(() => { if (ativo) setCarregado(true); });

    return () => { ativo = false; };
  }, [admin]);

  const loading = admin && !carregado;

  const desativarMinhaConta = async () => {
    const aviso = 'Desativar sua conta é reversível apenas pelo suporte. Seus dados serão '
      + 'preservados, porém você será desconectado. Deseja continuar?';
    if (!window.confirm(aviso)) return;

    try {
      await api.delete('/usuarios/desativar-conta');
      limparSessao();
      navigate('/login', { replace: true });
    } catch (err) {
      setErro(getApiError(err, 'Erro ao desativar conta. Tente novamente.'));
    }
  };

  const alterarRole = async (userId, novaRole) => {
    try {
      await api.patch(`/usuarios/${userId}/role`, { role: novaRole });
      setUsuariosList((prev) => prev.map((u) => (u.id === userId ? { ...u, role: novaRole } : u)));
    } catch (err) {
      setErro(getApiError(err, 'Erro ao alterar role.'));
    }
  };

  const alterarSituacao = async (u, acao) => {
    const rotulo = acao === 'desativar' ? 'Desativar' : 'Reativar';
    if (!window.confirm(`${rotulo} a conta de ${u.nome}?`)) return;

    try {
      await api[acao === 'desativar' ? 'delete' : 'patch'](`/usuarios/${u.id}/${acao}`);
      setUsuariosList((prev) => prev.filter((outro) => outro.id !== u.id));
    } catch (err) {
      setErro(getApiError(err, `Erro ao ${acao} usuário.`));
    }
  };

  return (
    <>
      <DashboardNavbar />
      <div className="dashboard-layout">
        <main className="dashboard-content">
          <section className="welcome-section">
            <h1 className="welcome-title">Configurações</h1>
            <p className="welcome-desc">
              Gerencie seu perfil. Se for ADMIN, gerencie também os usuários.
            </p>
          </section>

          {erro && <p className="calc-feedback erro">{erro}</p>}

          <div className="calc-card" style={{ marginBottom: 20 }}>
            <h3>Meu Perfil</h3>
            <p><strong>Nome:</strong> {usuario.nome || '—'}</p>
            <p><strong>E-mail:</strong> {usuario.email || '—'}</p>
            <p>
              <strong>Perfil:</strong>{' '}
              <span className="role-badge">{admin ? 'Administrador' : 'Aluno'}</span>
            </p>
          </div>

          <div className="calc-card" style={{ marginBottom: 20 }}>
            <h3>Zona de Perigo</h3>
            <p>
              Desativar sua conta é uma ação reversível apenas pelo suporte. Seus dados serão
              preservados, porém você será desconectado.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-cancel" onClick={() => navigate('/meus-treinos')}>Cancelar</button>
              <button className="btn btn-danger" onClick={desativarMinhaConta}>Desativar minha conta</button>
            </div>
          </div>

          {admin && (
            <div className="calc-card">
              <h3>Painel de Administração</h3>
              {loading ? (
                <p>Carregando usuários...</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-tabela">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Role</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosList.map((u) => (
                        <tr key={u.id}>
                          <td>{u.nome}</td>
                          <td>{u.email}</td>
                          <td>{u.role}</td>
                          <td>
                            <button
                              className="btn btn-cancel"
                              onClick={() => alterarRole(u.id, u.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                            >
                              {u.role === 'ADMIN' ? 'Tornar Aluno' : 'Tornar Admin'}
                            </button>
                            {u.ativo === false ? (
                              <button className="btn btn-success" onClick={() => alterarSituacao(u, 'reativar')}>
                                Reativar
                              </button>
                            ) : (
                              <button className="btn btn-danger" onClick={() => alterarSituacao(u, 'desativar')}>
                                Desativar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
