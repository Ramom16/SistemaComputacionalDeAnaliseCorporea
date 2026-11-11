import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getApiError } from '../../../services/api';
import AuthCard from '../../../components/auth/AuthCard';
import '../../../styles/auth.css';

/**
 * Formulário genérico de "envie-me um link por e-mail".
 * Usada por /verificar-email (link de verificação) e por /recuperar-senha
 * (link de recuperação), por isso o endpoint é configurável.
 */
export default function ReenviarEmail({
  titulo,
  voltarPara = '/login',
  mensagemInicial = '',
  endpoint = '/auth/reenviar-email',
  rotuloBotao = 'Enviar novo link',
  mensagemSucesso = 'Enviamos um novo link. Verifique seu e-mail.',
}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(mensagemInicial);
  const [tipo, setTipo] = useState(mensagemInicial ? 'erro' : 'neutro');

  const reenviar = async (event) => {
    event.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setTipo('erro');
      setMsg('Informe um e-mail válido.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post(endpoint, { email: trimmed });
      setTipo('sucesso');
      setMsg(data?.msg || mensagemSucesso);
    } catch (error) {
      setTipo('erro');
      setMsg(getApiError(error, 'Erro ao reenviar o e-mail.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard titulo={titulo}>
      <p className={`auth-msg ${tipo}`} role="status">{msg}</p>

      <form className="auth-form" onSubmit={reenviar}>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          placeholder="seu-email@dominio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : rotuloBotao}
        </button>
      </form>

      <Link className="auth-voltar" to={voltarPara}>Voltar para o login</Link>
    </AuthCard>
  );
}
