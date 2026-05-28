import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('Informe seu e-mail para receber um novo link.');

  const handleReenviar = async () => {
    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setMsg('Informe um e-mail válido.');
      return;
    }

    setLoading(true);
    setMsg('Enviando...');

    try {
      const response = await fetch('http://localhost:3000/auth/reenviar-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailTrimmed })
      });

      let data = null;
      try {
        data = await response.json();
      } catch (e) {
        data = null;
      }

      if (!response.ok) {
        setMsg((data && data.erro) ? data.erro : 'Erro ao reenviar o e-mail.');
        return;
      }

      setMsg((data && data.msg) ? data.msg : 'Enviamos um novo link de verificação. Verifique seu e-mail.');

    } catch (error) {
      setMsg(error.message || 'Erro de comunicação com a API.');
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
        <h2>Reenviar link de verificação</h2>
        <p style={{ marginBottom: '20px', fontWeight: 'bold' }}>{msg}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="seu-email@dominio.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
          
          <button 
            onClick={handleReenviar} 
            disabled={loading}
            style={{
              padding: '10px',
              backgroundColor: loading ? 'gray' : '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Enviando...' : 'Enviar novo link'}
          </button>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}
