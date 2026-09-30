import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getApiError } from '../../services/api';
import AuthCard from '../../components/AuthCard';
import '../../styles/auth.css';

/**
 * Pede um novo link de verificação de e-mail.
 * Usada tanto por /verificar-email quanto por /recuperar-senha.
 */
export default function ReenviarEmail({ titulo, voltarPara = '/login', mensagemInicial = '' }) {
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
      const { data } = await api.post('/auth/reenviar-email', { email: trimmed });
      setTipo('sucesso');
      setMsg(data?.msg || 'Enviamos um novo link. Verifique seu e-mail.');
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
          {loading ? 'Enviando...' : 'Enviar novo link'}
        </button>
      </form>

      <Link className="auth-voltar" to={voltarPara}>Voltar para o login</Link>
    </AuthCard>
  );
}
