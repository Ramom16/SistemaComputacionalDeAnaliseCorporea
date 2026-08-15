import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [msg, setMsg] = useState('Verificando seu e-mail...');
  const [showReauth, setShowReauth] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const chamouApi = useRef(false);

  useEffect(() => {
    async function verificarEmail() {
      if (!token) {
        setMsg('Token de verificação não encontrado na URL.');
        setShowReauth(true);
        return;
      }

      if (chamouApi.current) return;
      chamouApi.current = true;

      try {
        const response = await api.get('/auth/verificar-email', {
          params: { token }
        });

        setMsg(response.data.msg || 'E-mail verificado com sucesso!');
        setSucesso(true);
        setShowReauth(false);
      } catch (error) {
        const mensagemErro = error.response?.data?.erro || 'Erro ao verificar e-mail.';
        setMsg(mensagemErro);
        setShowReauth(true);
      }
    }

    verificarEmail();
  }, [token]);

  const handleReenviar = async (e) => {
    e.preventDefault();
    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setMsg('Digite o seu e-mail para receber um novo link.');
      return;
    }

    setLoading(true);
    setMsg('Enviando novo link de verificação...');

    try {
      const response = await api.post('/auth/reenviar-email', { email: emailTrimmed });
      setMsg(response.data.msg || 'Novo link enviado com sucesso! Verifique sua caixa de entrada.');
      setShowReauth(false);
    } catch (error) {
      const mensagemErro = error.response?.data?.erro || 'Erro ao reenviar e-mail.';
      setMsg(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Inter', 'Arial', sans-serif",
      textAlign: 'center',
      paddingTop: '80px',
      backgroundColor: '#070707',
      minHeight: '100vh',
      color: '#fff'
    }}>
      <div style={{
        background: '#121212',
        width: '420px',
        maxWidth: '90%',
        margin: 'auto',
        padding: '40px 30px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0px 0px 20px rgba(0,0,0,0.8)'
      }}>
        <h2 style={{ fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', fontStyle: 'italic', color: '#ffe600', fontSize: '28px', marginBottom: '15px' }}>
          Verificação de E-mail
        </h2>

        <p style={{
          fontWeight: '500',
          fontSize: '15px',
          color: sucesso ? '#4caf50' : (showReauth ? '#ff5252' : '#b0b0b0'),
          marginBottom: '20px',
          lineHeight: '1.5'
        }}>
          {msg}
        </p>

        {sucesso && (
          <div style={{ marginTop: '20px' }}>
            <Link to="/login" style={{
              display: 'inline-block',
              padding: '12px 28px',
              backgroundColor: '#ffe600',
              color: '#000',
              fontWeight: 'bold',
              fontFamily: "'Oswald', sans-serif",
              fontSize: '16px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '6px'
            }}>
              Ir para o Login
            </Link>
          </div>
        )}

        {showReauth && (
          <form onSubmit={handleReenviar} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p style={{ color: '#888', fontSize: '13px' }}>
              Se o seu link expirou ou não funcionou, digite seu e-mail abaixo para solicitar um novo.
            </p>

            <input 
              type="email" 
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: '14px',
                borderRadius: '6px',
                border: '1px solid #333',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                outline: 'none'
              }}
            />

            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '14px',
                backgroundColor: loading ? '#555' : '#ffe600',
                color: '#000',
                fontWeight: 'bold',
                fontFamily: "'Oswald', sans-serif",
                fontSize: '16px',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Enviando...' : 'Reenviar E-mail'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '25px' }}>
          <Link to="/login" style={{ color: '#ffe600', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
            ← Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}