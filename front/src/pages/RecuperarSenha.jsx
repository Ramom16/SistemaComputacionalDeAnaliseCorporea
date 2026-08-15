import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export default function RecuperarSenha() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (token) {
      setMsg('Informe sua nova senha abaixo para redefinir o acesso.');
    } else {
      setMsg('Informe seu e-mail para receber as instruções de recuperação.');
    }
  }, [token]);

  const handleSolicitarRecuperacao = async (e) => {
    e.preventDefault();
    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setMsg('Informe um e-mail válido.');
      return;
    }

    setLoading(true);
    setMsg('Enviando...');

    try {
      const response = await api.post('/auth/solicitar-recuperacao', { email: emailTrimmed });
      setMsg(response.data?.msg || 'Se o e-mail estiver cadastrado, você receberá o link em breve.');
      setSucesso(true);
    } catch (error) {
      const mensagemErro = error.response?.data?.erro || error.message || 'Erro ao solicitar recuperação.';
      setMsg(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  const handleRedefinirSenha = async (e) => {
    e.preventDefault();
    if (!novaSenha || novaSenha.length < 6) {
      setMsg('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMsg('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    setMsg('Redefinindo senha...');

    try {
      const response = await api.post('/auth/redefinir-senha', { token, novaSenha });
      setMsg(response.data?.msg || 'Senha redefinida com sucesso! Você já pode fazer login.');
      setSucesso(true);
    } catch (error) {
      const mensagemErro = error.response?.data?.erro || error.message || 'Erro ao redefinir a senha.';
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
        <h2 style={{ fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', fontStyle: 'italic', color: '#ffe600', fontSize: '28px', marginBottom: '10px' }}>
          {token ? 'Redefinir Senha' : 'Recuperar Senha'}
        </h2>
        <p style={{ marginBottom: '25px', color: '#b0b0b0', fontSize: '14px', lineHeight: '1.5' }}>{msg}</p>
        
        {!token ? (
          <form onSubmit={handleSolicitarRecuperacao} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
              disabled={loading || sucesso}
              style={{
                padding: '14px',
                backgroundColor: loading || sucesso ? '#555' : '#ffe600',
                color: '#000',
                fontWeight: 'bold',
                fontFamily: "'Oswald', sans-serif",
                fontSize: '16px',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: '6px',
                cursor: loading || sucesso ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Enviando...' : 'Enviar Link'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRedefinirSenha} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="password" 
              placeholder="Nova senha (mínimo 6 caracteres)" 
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
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

            <input 
              type="password" 
              placeholder="Confirme a nova senha" 
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
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
              disabled={loading || sucesso}
              style={{
                padding: '14px',
                backgroundColor: loading || sucesso ? '#555' : '#ffe600',
                color: '#000',
                fontWeight: 'bold',
                fontFamily: "'Oswald', sans-serif",
                fontSize: '16px',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: '6px',
                cursor: loading || sucesso ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Redefinindo...' : 'Salvar Nova Senha'}
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