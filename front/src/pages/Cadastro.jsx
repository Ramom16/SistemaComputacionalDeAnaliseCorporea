import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/cadastro.css';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [data_nascimento, setDataNascimento] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, email, senha, data_nascimento })
      });

      const data = await response.json();

      if (!response.ok) {
        setMsg({ text: data.erro || 'Erro no cadastro', type: 'erro' });
        return;
      }

      setMsg({ text: data.msg, type: 'sucesso' });
      // Clear fields on success
      setNome('');
      setEmail('');
      setSenha('');
      setDataNascimento('');

    } catch (error) {
      setMsg({ text: 'Erro: API não respondeu', type: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="navbar">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <span className="logo-bar"></span>
            <span className="logo-bar"></span>
            <span className="logo-bar"></span>
          </div>
          <span className="logo-text">IRONFIT</span>
        </Link>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Início</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/cadastro" style={{ color: 'var(--primary-yellow)' }}>Cadastrar</Link></li>
          </ul>
        </nav>
      </header>

      <section className="cadastro-hero">
        <div className="cadastro-wrapper">
          <div className="cadastro-container">
            <div className="cadastro-header">
              <h2>Crie sua<br />conta</h2>
              <p>Comece sua transformação hoje</p>
              <div className="accent-line"></div>
            </div>

            <form id="formCadastro" onSubmit={handleCadastro}>
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input 
                  type="text" 
                  id="nome" 
                  placeholder="Seu nome completo" 
                  required 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="seu@email.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input 
                  type="password" 
                  id="senha" 
                  placeholder="Mínimo 6 caracteres" 
                  required 
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="data_nascimento">Data de Nascimento</label>
                <input 
                  type="date" 
                  id="data_nascimento" 
                  required 
                  value={data_nascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                />
              </div>
              <button type="submit" id="btnCadastro" className="btn-cadastro" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </form>

            {msg.text && (
              <p id="msg" className={msg.type}>{msg.text}</p>
            )}

            <div className="link-login">
              <span>Já tem conta? </span>
              <Link to="/login">Faça login</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
