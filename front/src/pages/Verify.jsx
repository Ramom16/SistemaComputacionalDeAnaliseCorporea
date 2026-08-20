import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import AlertMessage from '../components/AlertMessage';
import '../styles/login.css';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [msg, setMsg] = useState({ text: 'Verificando seu e-mail...', type: '' });
  const [showReauth, setShowReauth] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const chamouApi = useRef(false);

  useEffect(() => {
    async function verificarEmail() {
      if (!token) {
        setMsg({ text: 'Token não fornecido. Digite seu e-mail abaixo para receber um link de verificação.', type: '' });
        setShowReauth(true);
        return;
      }

      if (chamouApi.current) return;
      chamouApi.current = true;

      try {
        const response = await api.get('/auth/verificar-email', {
          params: { token }
        });

        setMsg({ text: response.data?.msg || 'E-mail verificado com sucesso!', type: 'sucesso' });
        setSucesso(true);
        setShowReauth(false);
      } catch (error) {
        const mensagemErro = error.response?.data?.erro || 'Erro ao verificar e-mail. O link pode ter expirado.';
        setMsg({ text: mensagemErro, type: 'erro' });
        setShowReauth(true);
      }
    }

    verificarEmail();
  }, [token]);

  const handleReenviar = async (e) => {
    e.preventDefault();
    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setMsg({ text: 'Digite o seu e-mail para receber um novo link.', type: 'erro' });
      return;
    }

    setLoading(true);
    setMsg({ text: '', type: '' });

    try {
      const response = await api.post('/auth/reenviar-email', { email: emailTrimmed });
      setMsg({ text: response.data?.msg || 'Novo link enviado com sucesso! Verifique sua caixa de entrada.', type: 'sucesso' });
      setShowReauth(false);
    } catch (error) {
      const mensagemErro = error.response?.data?.erro || 'Erro ao reenviar e-mail de verificação.';
      setMsg({ text: mensagemErro, type: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar>
        <li><Link to="/">Início</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/cadastro">Cadastrar</Link></li>
      </Navbar>

      <section className="login-hero">
        <div className="login-wrapper">
          <div className="login-container">
            <div className="login-header">
              <h2>Verificação<br />de E-mail</h2>
              <p>Confirme seu acesso à plataforma</p>
              <div className="accent-line"></div>
            </div>

            <AlertMessage msg={msg} />

            {sucesso && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link to="/login" className="btn-login" style={{ display: 'inline-block', textDecoration: 'none' }}>
                  Ir para o Login
                </Link>
              </div>
            )}

            {showReauth && (
              <form onSubmit={handleReenviar} style={{ marginTop: '20px' }}>
                <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>
                  Se o seu link expirou ou você não o recebeu, informe seu e-mail abaixo para solicitar um novo envio.
                </p>

                <Input 
                  label="E-mail" 
                  id="emailReenviar" 
                  type="email" 
                  placeholder="seu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />

                <button type="submit" className="btn-login" disabled={loading}>
                  {loading ? 'Enviando...' : 'Reenviar E-mail'}
                </button>
              </form>
            )}

            <div className="link-cadastro">
              <Link to="/login">← Voltar para o Login</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}