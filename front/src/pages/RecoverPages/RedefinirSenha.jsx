import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api, { getApiError } from '../../services/api';
import AuthCard from '../../components/AuthCard';
import '../../styles/auth.css';

export default function RedefinirSenha() {
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [novaSenha, setNovaSenha] = useState('');
  const [loading, setLoading] = useState('');
  const [msg, setMsg] = useState('');
  const [tipo, setTipo] = useState('neutro');

  /** Um submit por tela: cada formulário monta seu próprio par endpoint/payload. */
  const enviar = async ({ chave, endpoint, payload, fallback, limpar }) => {
    setLoading(chave);
    try {
      const { data } = await api.post(endpoint, payload);
      setTipo('sucesso');
      setMsg(data.msg || fallback);
      limpar?.();
    } catch (error) {
      setTipo('erro');
      setMsg(getApiError(error, fallback));
    } finally {
      setLoading('');
    }
  };

  const solicitarRecuperacao = (event) => {
    event.preventDefault();
    enviar({
      chave: 'solicitar',
      endpoint: '/auth/solicitar-recuperacao',
      payload: { email },
      fallback: 'Não foi possível solicitar a recuperação.',
    });
  };

  const redefinir = (event) => {
    event.preventDefault();
    enviar({
      chave: 'redefinir',
      endpoint: '/auth/redefinir-senha',
      payload: { token: token.trim(), novaSenha },
      fallback: 'Não foi possível redefinir sua senha.',
      limpar: () => setNovaSenha(''),
    });
  };

  return (
    <AuthCard titulo="Recuperar senha">
      <p className="auth-subtitulo">
        Solicite um link ou informe o token recebido para criar uma nova senha.
      </p>

      <form className="auth-form" onSubmit={solicitarRecuperacao}>
        <h2>Solicitar link</h2>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading === 'solicitar'}>
          {loading === 'solicitar' ? 'Enviando...' : 'Enviar link de recuperação'}
        </button>
      </form>

      <form className="auth-form" onSubmit={redefinir}>
        <h2>Definir nova senha</h2>
        <label htmlFor="token">Token</label>
        <input id="token" value={token} onChange={(e) => setToken(e.target.value)} required />
        <label htmlFor="novaSenha">Nova senha</label>
        <input
          id="novaSenha"
          type="password"
          minLength="6"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          required
        />
        <button type="submit" disabled={loading === 'redefinir'}>
          {loading === 'redefinir' ? 'Salvando...' : 'Redefinir senha'}
        </button>
      </form>

      {msg && <p className={`auth-msg ${tipo}`} role="status">{msg}</p>}

      <Link className="auth-voltar" to="/login">Voltar para o login</Link>
    </AuthCard>
  );
}
