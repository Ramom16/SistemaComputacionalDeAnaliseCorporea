import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import AlertMessage from '../components/AlertMessage';
import '../styles/login.css';

export default function RecuperarSenha() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (token) {
      setMsg({ text: 'Informe sua nova senha abaixo para redefinir o acesso.', type: '' });
    } else {
      setMsg({ text: 'Informe seu e-mail para receber o link de recuperação.', type: '' });
    }
  }, [token]);

  const handleSolicitarRecuperacao = async (e) => {
    e.preventDefault();
    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setMsg({ text: 'Informe um e-mail válido.', type: 'erro' });
      return;
    }

    setLoading(true);
    setMsg({ text: '', type: '' });

    try {
      const response = await api.post('/auth/solicitar-recuperacao', { email: emailTrimmed });
      setMsg({ text: response.data?.msg || 'Se o e-mail estiver cadastrado, você receberá o link em breve.', type: 'sucesso' });
      setSucesso(true);
    } catch (error) {
      const mensagemErro = error.response?.data?.erro || error.message || 'Erro ao solicitar recuperação.';
      setMsg({ text: mensagemErro, type: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const handleRedefinirSenha = async (e) => {
    e.preventDefault();
    if (!novaSenha || novaSenha.length < 6) {
      setMsg({ text: 'A nova senha deve ter no mínimo 6 caracteres.', type: 'erro' });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMsg({ text: 'As senhas não coincidem.', type: 'erro' });
      return;
    }

    setLoading(true);
    setMsg({ text: '', type: '' });

    try {
      const response = await api.post('/auth/redefinir-senha', { token, novaSenha });
      setMsg({ text: response.data?.msg || 'Senha redefinida com sucesso! Você já pode fazer login.', type: 'sucesso' });
      setSucesso(true);
    } catch (error) {
      const mensagemErro = error.response?.data?.erro || error.message || 'Erro ao redefinir a senha.';
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
              <h2>{token ? 'Redefinir\nsenha' : 'Recuperar\nsenha'}</h2>
              <p>{token ? 'Crie uma nova senha de acesso' : 'Receba as instruções no seu e-mail'}</p>
              <div className="accent-line"></div>
            </div>

            {!token ? (
              <form onSubmit={handleSolicitarRecuperacao}>
                <Input 
                  label="E-mail" 
                  id="emailRecuperacao" 
                  type="email" 
                  placeholder="seu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || sucesso}
                />
                
                <button type="submit" className="btn-login" disabled={loading || sucesso}>
                  {loading ? 'Enviando...' : 'Enviar Link'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRedefinirSenha}>
                <Input 
                  label="Nova Senha" 
                  id="novaSenha" 
                  type="password" 
                  placeholder="Mínimo 6 caracteres" 
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  disabled={loading || sucesso}
                />

                <Input 
                  label="Confirmar Senha" 
                  id="confirmarSenha" 
                  type="password" 
                  placeholder="Repita a nova senha" 
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  disabled={loading || sucesso}
                />
                
                <button type="submit" className="btn-login" disabled={loading || sucesso}>
                  {loading ? 'Redefinindo...' : 'Salvar Nova Senha'}
                </button>
              </form>
            )}

            <AlertMessage msg={msg} />

            <div className="link-cadastro">
              <Link to="/login">← Voltar para o Login</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}