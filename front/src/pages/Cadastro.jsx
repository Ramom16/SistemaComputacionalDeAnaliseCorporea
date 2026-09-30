import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getApiError } from '../services/api';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import AlertMessage from '../components/AlertMessage';
import '../styles/cadastro.css';

const CAMPOS = [
  { id: 'nome', label: 'Nome', type: 'text', placeholder: 'Seu nome completo' },
  { id: 'email', label: 'E-mail', type: 'email', placeholder: 'seu@email.com' },
  { id: 'senha', label: 'Senha', type: 'password', placeholder: 'Mínimo 6 caracteres' },
  { id: 'data_nascimento', label: 'Data de Nascimento', type: 'date' },
];

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', data_nascimento: '',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleCadastro = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const { data } = await api.post('/auth/register', form);
      setMsg({ texto: data.msg || 'Cadastro realizado!', tipo: 'sucesso' });
      setForm({ nome: '', email: '', senha: '', data_nascimento: '' });
    } catch (error) {
      setMsg({ texto: getApiError(error, 'Erro ao cadastrar usuário'), tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar>
        <li><Link to="/">Início</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/cadastro" style={{ color: 'var(--primary-yellow)' }}>Cadastrar</Link></li>
      </Navbar>

      <section className="cadastro-hero">
        <div className="cadastro-wrapper">
          <div className="cadastro-container">
            <div className="cadastro-header">
              <h2>Crie sua conta</h2>
              <p>Comece sua transformação hoje</p>
              <div className="accent-line"></div>
            </div>

            <form onSubmit={handleCadastro}>
              {CAMPOS.map((campo) => (
                <Input
                  key={campo.id}
                  label={campo.label}
                  id={campo.id}
                  type={campo.type}
                  placeholder={campo.placeholder}
                  value={form[campo.id]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [campo.id]: e.target.value }))}
                />
              ))}
              <button type="submit" className="btn-cadastro" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </form>

            <AlertMessage msg={msg} />

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
