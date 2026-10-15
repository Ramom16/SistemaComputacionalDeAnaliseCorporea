import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
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

const REGRAS_SENHA = [
  { id: 'minimo', label: 'Mínimo de 6 carateres', testar: (senha) => senha.length >= 6 },
  { id: 'especial', label: 'Pelo menos um caractere especial (!@#$%...)', testar: (senha) => /[\W_]/.test(senha) },
  { id: 'numero', label: 'Pelo menos um número', testar: (senha) => /\d/.test(senha) },
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
                <Fragment key={campo.id}>
                  <Input
                    label={campo.label}
                    id={campo.id}
                    type={campo.type}
                    placeholder={campo.placeholder}
                    value={form[campo.id]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [campo.id]: e.target.value }))}
                  />

                  {campo.id === 'senha' && (
                    <ul className="senha-regras">
                      {REGRAS_SENHA.map((regra) => {
                        const cumprida = regra.testar(form.senha);
                        return (
                          <li key={regra.id} className={cumprida ? 'cumprida' : ''}>
                            <span className="regra-icone">
                              {cumprida ? <FaCheck /> : <FaTimes />}
                            </span>
                            <span>{regra.label}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </Fragment>
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
