import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getApiError } from '../services/api';
import { salvarSessao } from '../services/auth';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import AlertMessage from '../components/AlertMessage';
import '../styles/login.css';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const { data } = await api.post('/auth/login', { email, senha });
      salvarSessao({ token: data.token, usuario: data.usuario });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const erro = getApiError(error, 'Erro: API não respondeu');
      const contaDesativada = error.response?.status === 403 && erro.includes('desativada');

      setMsg({
        texto: contaDesativada
          ? 'Sua conta está desativada. Contate o suporte para reativar.'
          : erro,
        tipo: 'erro',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar>
        <li><Link to="/">Início</Link></li>
        <li><Link to="/login" style={{ color: 'var(--primary-yellow)' }}>Login</Link></li>
        <li><Link to="/cadastro">Cadastrar</Link></li>
      </Navbar>

      <section className="login-hero">
        <div className="login-wrapper">
          <div className="login-container">
            <div className="login-header">
              <h2>Acesse sua conta</h2>
              <p>Entre para continuar sua jornada</p>
              <div className="accent-line"></div>
            </div>

            <form onSubmit={handleLogin}>
              <Input
                label="E-mail"
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Senha"
                id="senha"
                type="password"
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <AlertMessage msg={msg} />

            <div className="link-cadastro">
              <span>Não tem conta? </span>
              <Link to="/cadastro">Cadastre-se</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
