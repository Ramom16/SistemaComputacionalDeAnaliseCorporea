import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import PasswordChecklist from '../components/PasswordChecklist';
import { useFeedback } from '../hooks/useFeedback';
import { Skeleton } from '../components/Skeleton';
import api, { unwrap, getApiError } from '../services/api';
import { getUsuario, atualizarUsuario, limparSessao, isAdmin } from '../services/auth';
import { senhaValida } from '../constants/senha';
import '../styles/dashboard.css';

const SENHA_VAZIA = { senhaAtual: '', novaSenha: '', confirmar: '' };

export default function Configuracoes() {
  const navigate = useNavigate();
  const admin = isAdmin();
  const { toast, confirmar } = useFeedback();

  const [usuario, setUsuario] = useState(getUsuario());

  const [usuariosList, setUsuariosList] = useState([]);
  const [carregado, setCarregado] = useState(false);
  const [erro, setErro] = useState('');

  // Foto de perfil
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [salvandoFoto, setSalvandoFoto] = useState(false);
  const [feedbackFoto, setFeedbackFoto] = useState(null);

  // Alterar palavra-passe
  const [formSenha, setFormSenha] = useState(SENHA_VAZIA);
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [feedbackSenha, setFeedbackSenha] = useState(null);

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
    const confirmado = await confirmar({
      titulo: 'Desativar conta',
      mensagem: 'Desativar sua conta é reversível apenas pelo suporte. Seus dados serão '
        + 'preservados, porém você será desconectado.',
      textoConfirmar: 'Desativar',
      perigoso: true,
    });
    if (!confirmado) return;

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
      toast.sucesso('Perfil de acesso atualizado.');
    } catch (err) {
      toast.erro(getApiError(err, 'Erro ao alterar role.'));
    }
  };

  const alterarSituacao = async (u, acao) => {
    const desativando = acao === 'desativar';
    const rotulo = desativando ? 'Desativar' : 'Reativar';

    const confirmado = await confirmar({
      titulo: `${rotulo} conta`,
      mensagem: `${rotulo} a conta de ${u.nome}?`,
      textoConfirmar: rotulo,
      perigoso: desativando,
    });
    if (!confirmado) return;

    try {
      await api[desativando ? 'delete' : 'patch'](`/usuarios/${u.id}/${acao}`);
      setUsuariosList((prev) => prev.filter((outro) => outro.id !== u.id));
      toast.sucesso(`Conta de ${u.nome} ${desativando ? 'desativada' : 'reativada'}.`);
    } catch (err) {
      toast.erro(getApiError(err, `Erro ao ${acao} usuário.`));
    }
  };

  const selecionarFoto = (event) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;
    setFoto(arquivo);
    setPreview(URL.createObjectURL(arquivo));
    setFeedbackFoto(null);
  };

  const enviarFoto = async (event) => {
    event.preventDefault();

    if (!foto) {
      setFeedbackFoto({ texto: 'Selecione uma imagem primeiro.', tipo: 'erro' });
      return;
    }

    try {
      setSalvandoFoto(true);
      setFeedbackFoto(null);

      const dados = new FormData();
      dados.append('image', foto);

      const { data } = await api.patch('/usuarios/foto-perfil', dados);
      const fotoPerfil = data?.usuario?.fotoPerfil;

      if (fotoPerfil) {
        const atualizado = atualizarUsuario({ fotoPerfil });
        setUsuario(atualizado);
        setPreview('');
        setFoto(null);
      }

      setFeedbackFoto({ texto: data?.mensagem || 'Foto de perfil atualizada!', tipo: 'sucesso' });
    } catch (err) {
      setFeedbackFoto({ texto: getApiError(err, 'Erro ao enviar a foto.'), tipo: 'erro' });
    } finally {
      setSalvandoFoto(false);
    }
  };

  const alterarCampoSenha = (event) => {
    const { name, value } = event.target;
    setFormSenha((prev) => ({ ...prev, [name]: value }));
  };

  const submeterSenha = async (event) => {
    event.preventDefault();
    setFeedbackSenha(null);

    if (!senhaValida(formSenha.novaSenha)) {
      setFeedbackSenha({ texto: 'A nova palavra-passe não cumpre os requisitos.', tipo: 'erro' });
      return;
    }

    if (formSenha.novaSenha !== formSenha.confirmar) {
      setFeedbackSenha({ texto: 'A confirmação não coincide com a nova palavra-passe.', tipo: 'erro' });
      return;
    }

    try {
      setSalvandoSenha(true);
      await api.post('/auth/alterar-senha', {
        senhaAtual: formSenha.senhaAtual,
        novaSenha: formSenha.novaSenha,
      });
      setFeedbackSenha({ texto: 'Palavra-passe alterada com sucesso!', tipo: 'sucesso' });
      setFormSenha(SENHA_VAZIA);
    } catch (err) {
      setFeedbackSenha({ texto: getApiError(err, 'Erro ao alterar a palavra-passe.'), tipo: 'erro' });
    } finally {
      setSalvandoSenha(false);
    }
  };

  const fotoExibida = preview || usuario.fotoPerfil;
  const iniciais = (usuario.nome || '?').trim().charAt(0).toUpperCase();

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

            <form className="perfil-topo" onSubmit={enviarFoto}>
              <div className="perfil-avatar">
                {fotoExibida
                  ? <img src={fotoExibida} alt="Foto de perfil" />
                  : <span className="perfil-avatar-iniciais">{iniciais}</span>}
              </div>

              <div className="perfil-dados">
                <p><strong>Nome:</strong> {usuario.nome || '—'}</p>
                <p><strong>E-mail:</strong> {usuario.email || '—'}</p>
                <p>
                  <strong>Perfil:</strong>{' '}
                  <span className="role-badge">{admin ? 'Administrador' : 'Aluno'}</span>
                </p>

                <div className="perfil-foto-acoes">
                  <label className="btn btn-cancel perfil-foto-label">
                    Escolher foto
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={selecionarFoto}
                      hidden
                    />
                  </label>
                  <button type="submit" className="btn btn-calc" disabled={salvandoFoto || !foto}>
                    {salvandoFoto ? 'Enviando...' : 'Salvar foto'}
                  </button>
                </div>

                {feedbackFoto && (
                  <p className={`calc-feedback ${feedbackFoto.tipo}`}>{feedbackFoto.texto}</p>
                )}
              </div>
            </form>
          </div>

          <div className="calc-card" style={{ marginBottom: 20 }}>
            <h3>Alterar Palavra-passe</h3>

            <form onSubmit={submeterSenha}>
              <div className="input-group">
                <label htmlFor="senhaAtual">Palavra-passe atual</label>
                <input
                  id="senhaAtual"
                  name="senhaAtual"
                  type="password"
                  value={formSenha.senhaAtual}
                  onChange={alterarCampoSenha}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="novaSenha">Nova palavra-passe</label>
                <input
                  id="novaSenha"
                  name="novaSenha"
                  type="password"
                  value={formSenha.novaSenha}
                  onChange={alterarCampoSenha}
                  required
                />
              </div>

              <PasswordChecklist senha={formSenha.novaSenha} />

              <div className="input-group" style={{ marginTop: 16 }}>
                <label htmlFor="confirmar">Confirmar nova palavra-passe</label>
                <input
                  id="confirmar"
                  name="confirmar"
                  type="password"
                  value={formSenha.confirmar}
                  onChange={alterarCampoSenha}
                  required
                />
              </div>

              {feedbackSenha && (
                <p className={`calc-feedback ${feedbackSenha.tipo}`}>{feedbackSenha.texto}</p>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button type="submit" className="btn btn-calc" disabled={salvandoSenha}>
                  {salvandoSenha ? 'A alterar...' : 'Alterar palavra-passe'}
                </button>
              </div>
            </form>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} aria-busy="true">
                  {Array.from({ length: 4 }).map((_, indice) => (
                    <Skeleton key={indice} variante="texto" altura="38px" />
                  ))}
                </div>
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
