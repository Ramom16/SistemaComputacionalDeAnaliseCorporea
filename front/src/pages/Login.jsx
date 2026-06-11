import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/login.css';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import AlertMessage from '../components/AlertMessage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loginData, setLoginData] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });
    setLoginData(null);

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        setMsg({ text: data.erro || 'Erro no login', type: 'erro' });
        return;
      }

      setMsg({ text: data.msg, type: 'sucesso' });
      setLoginData({
        token: data.token,
        nome: data.usuario?.nome || 'Usuário'
      });
      
      // Salvar dados do usuário no localStorage para uso em outras páginas
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);

    } catch (error) {
      setMsg({ text: 'Erro: API não respondeu', type: 'erro' });
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
              <h2>Acesse sua<br />conta</h2>
              <p>Entre para continuar sua jornada</p>
              <div className="accent-line"></div>
            </div>

            <form id="formLogin" onSubmit={handleLogin}>
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
              <button type="submit" id="btnLogin" className="btn-login" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <AlertMessage msg={msg} />

            {loginData && (
              <div className="retorno" id="retorno" style={{ display: 'block' }}>
                <div className="retorno-info">
                  <p><strong>Token de Acesso:</strong></p>
                  <p id="token" style={{ wordBreak: 'break-all', fontSize: '12px', marginTop: '4px', color: 'var(--primary-yellow)' }}>
                    {loginData.token}
                  </p>
                </div>
                <div className="retorno-info" style={{ marginTop: '10px' }}>
                  <p id="retornoUsuario">Bem-vindo, {loginData.nome}!</p>
                </div>
              </div>
            )}

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
