import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { getApiError } from '../services/api';
import AuthCard from '../components/AuthCard';
import ReenviarEmail from './RecoverPages/ReenviarEmail';
import '../styles/auth.css';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [msg, setMsg] = useState(
    token ? 'Verificando...' : 'Token não encontrado na URL.',
  );
  const [expirado, setExpirado] = useState(!token);

  useEffect(() => {
    if (!token) return;

    api.get('/auth/verificar-email', { params: { token } })
      .then(({ data }) => {
        setMsg(data.msg || 'Email verificado com sucesso!');
        setExpirado(false);
      })
      .catch((error) => {
        setMsg(getApiError(error, 'Erro ao verificar email.'));
        setExpirado(true);
      });
  }, [token]);

  if (expirado) {
    return (
      <ReenviarEmail
        titulo="Verificação de Email"
        mensagemInicial="Token expirado ou inválido. Informe seu e-mail para receber outro link."
      />
    );
  }

  return (
    <AuthCard titulo="Verificação de Email">
      <p className="auth-msg neutro" role="status">{msg}</p>
    </AuthCard>
  );
}
