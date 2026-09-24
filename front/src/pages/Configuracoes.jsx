import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import api from '../services/api';
import '../styles/dashboard.css';

export default function Configuracoes() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(() => JSON.parse(localStorage.getItem('usuario') || '{}'));
  const [usuariosList, setUsuariosList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    setUsuario(JSON.parse(localStorage.getItem('usuario') || '{}'));
  }, []);

  useEffect(() => {
    async function fetchUsuarios() {
      if (usuario?.role !== 'ADMIN') return;
      try {
        setLoading(true);
        const resp = await api.get('/usuarios');
        const data = resp.data || resp.data?.data || resp.data?.usuarios || resp.data;
        setUsuariosList(data.data || data || []);
      } catch (err) {
        console.error(err);
        setErro('Não foi possível carregar a lista de usuários.');
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarios();
  }, [usuario]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const confirmarDesativacaoConta = async () => {
    if (!window.confirm('Tem certeza que deseja desativar sua conta? Esta ação irá desconectá-lo.')) return;
    try {
      await api.delete('/usuarios/desativar-conta');
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setErro('Erro ao desativar conta. Tente novamente.');
    }
  };

  const alterarRole = async (userId, novaRole) => {
    try {
      await api.patch(`/usuarios/${userId}/role`, { role: novaRole });
      setUsuariosList(prev => prev.map(u => u.id === userId ? { ...u, role: novaRole } : u));
    } catch (err) {
      console.error(err);
      setErro('Erro ao alterar role.');
    }
  };

  const desativarOutroUsuario = async (userId) => {
    if (!window.confirm('Desativar esta conta? O usuário será bloqueado.')) return;
    try {
      // endpoint admin para desativar outro usuário: /usuarios/:id/desativar
      await api.delete(`/usuarios/${userId}/desativar`);
      setUsuariosList(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error(err);
      setErro('Erro ao desativar usuário.');
    }
  };

  const reativarOutroUsuario = async (userId) => {
    if (!window.confirm('Reativar esta conta? O usuário será desbloqueado.')) return;
    try {
      await api.patch(`/usuarios/${userId}/reativar`);
      setUsuariosList(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error(err);
      setErro('Erro ao reativar usuário.');
    }
  };  

  return (
    <>
      <DashboardNavbar onLogout={handleLogout} />
      <div className="dashboard-layout">
        <main className="dashboard-content">
          <section className="welcome-section">
            <h1 className="welcome-title">Configurações</h1>
            <p className="welcome-desc">Gerencie seu perfil e, se for ADMIN, gerencie usuários.</p>
          </section>

          {/* Perfil do Usuário */}
          <div className="calc-card" style={{ marginBottom: 20 }}>
            <h3>Meu Perfil</h3>
            <p><strong>Nome:</strong> {usuario?.nome || '—'}</p>
            <p><strong>E-mail:</strong> {usuario?.email || '—'}</p>
            <p>
              <strong>Perfil:</strong>{' '}
              <span style={{
                padding: '6px 10px',
                borderRadius: 16,
                background: usuario?.role === 'ADMIN' ? 'rgba(255, 230, 0, 0.15)' : 'rgba(255,255,255,0.03)',
                color: usuario?.role === 'ADMIN' ? 'var(--primary-yellow)' : 'var(--text-gray)'
              }}>{usuario?.role === 'ADMIN' ? 'Administrador' : 'Aluno'}</span>
            </p>
          </div>

          {/* Zona de Perigo */}
          <div className="calc-card" style={{ marginBottom: 20 }}>
            <h3>Zona de Perigo</h3>
            <p>Desativar sua conta é uma ação reversível apenas pelo suporte. Seus dados serão preservados, porém você será desconectado.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-cancel" onClick={() => navigate('/meus-treinos')}>Cancelar</button>
              <button className="btn btn-danger" onClick={confirmarDesativacaoConta}>Desativar minha conta</button>
            </div>
          </div>

          {/* Painel ADMIN */}
          {usuario?.role === 'ADMIN' && (
            <div className="calc-card">
              <h3>Painel de Administração</h3>
              {erro && <div style={{ color: '#ff6b75' }}>{erro}</div>}
              {loading ? (
                <p>Carregando usuários...</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Role</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosList.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '10px 8px' }}>{u.nome}</td>
                          <td style={{ padding: '10px 8px' }}>{u.email}</td>
                          <td style={{ padding: '10px 8px' }}>{u.role}</td>
                          <td style={{ padding: '10px 8px' }}>
                            <button onClick={() => alterarRole(u.id, u.role === 'ADMIN' ? 'USER' : 'ADMIN')} className="btn btn-cancel" style={{ marginRight: 8 }}>
                              {u.role === 'ADMIN' ? 'Tornar Aluno' : 'Tornar Admin'}
                            </button>
                            {u.ativo === true && (
                              <button onClick={() => desativarOutroUsuario(u.id)} className="btn btn-danger" style={{ marginRight: 8 }}>
                                Desativar
                              </button>
                            )}
                            {u.ativo === false && (
                              <button onClick={() => reativarOutroUsuario(u.id)} className="btn btn-success" style={{ marginRight: 8 }}>
                                Reativar
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
