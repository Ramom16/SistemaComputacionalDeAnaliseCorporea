import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api'; // Importação da instância do Axios (Ajuste o caminho se necessário)

export default function Verify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [msg, setMsg] = useState('Verificando...');
  const [showReauth, setShowReauth] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function verificarEmail() {
      if (!token) {
        setMsg('Token não encontrado na URL.');
        return;
      }

      try {
        const response = await api.get('/auth/verificar-email', {
          params: { token }
        });

        setMsg(response.data.msg || 'Email verificado com sucesso!');
        setShowReauth(false);
      } catch (error) {
        const mensagemErro = error.response?.data?.erro || 'Erro ao verificar email.';
        setMsg(mensagemErro);
        setShowReauth(true);
      }
    }

    verificarEmail();
  }, [token]);

  const handleReenviar = async () => {
    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setMsg('Digite seu e-mail.');
      return;
    }

    setLoading(true);
    setMsg('Enviando...');

    try {
      const response = await api.post('/auth/reenviar-email', { email: emailTrimmed });

      setMsg(response.data.msg || 'Novo link enviado para seu email.');
      setShowReauth(false);
    } catch (error) {
      const mensagemErro = error.response?.data?.erro || 'Erro ao reenviar email.';
      setMsg(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      paddingTop: '80px',
      backgroundColor: '#f4f4f4',
      minHeight: '100vh',
      color: '#333'
    }}>
      <div style={{
        background: 'white',
        width: '400px',
        maxWidth: '90%',
        margin: 'auto',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>Verificação de Email</h2>

        <p id="msg" style={{ fontWeight: 'bold', marginTop: '20px' }}>{msg}</p>

        {showReauth && (
          <>
            <p id="reauth" style={{ color: 'red', marginTop: '15px' }}>
              Token expirado ou inválido. Se não recebeu o e-mail, solicite outro link.
            </p>

            <input 
              type="email" 
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: '10px',
                width: '80%',
                marginTop: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />

            <br />

            <button 
              onClick={handleReenviar} 
              disabled={loading}
              style={{
                padding: '10px 20px',
                marginTop: '15px',
                cursor: loading ? 'not-allowed' : 'pointer',
                border: 'none',
                background: loading ? 'gray' : '#007bff',
                color: 'white',
                borderRadius: '5px'
              }}
            >
              {loading ? 'Enviando...' : 'Reenviar e-mail'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}