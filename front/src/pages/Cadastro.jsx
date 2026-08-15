import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/cadastro.css";
import Navbar from "../components/Navbar";
import Input from "../components/Input";
import AlertMessage from "../components/AlertMessage";
import api from "../services/api";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [data_nascimento, setDataNascimento] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const lidarCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    try {
      const response = await api.post("/auth/register", {
        nome,
        email,
        senha,
        data_nascimento
      });
      setMsg({ text: response.data?.msg || "Usuário cadastrado com sucesso!", type: "sucesso" });
      setNome("");
      setEmail("");
      setSenha("");
      setDataNascimento("");
    } catch (error) {
      const mensagemErro = error.response?.data?.erro || error.message || "Erro ao cadastrar";
      setMsg({ text: mensagemErro, type: "erro" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar>
        <li>
          <Link to="/">Início</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/cadastro" style={{ color: "var(--primary-yellow)" }}>
            Cadastrar
          </Link>
        </li>
      </Navbar>

      <section className="cadastro-hero">
        <div className="cadastro-wrapper">
          <div className="cadastro-container">
            <div className="cadastro-header">
              <h2>
                Crie sua
                <br />
                conta
              </h2>
              <p>Comece sua transformação hoje</p>
              <div className="accent-line"></div>
            </div>

            <form id="formCadastro" onSubmit={lidarCadastro}>
              <Input
                label="Nome"
                id="nome"
                type="text"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
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
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />

              <Input
                label="Data de Nascimento"
                id="data_nascimento"
                type="date"
                value={data_nascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
              />
              <button
                type="submit"
                id="btnCadastro"
                className="btn-cadastro"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </form>

            <AlertMessage msg={msg} />

            <div className="link-login">
              <span>Já tem conta? </span>
              <Link to="/login">Faça login</Link>{" "}
              {/* Para não precisar do <a> que serve para ir de uma página para outra fazendo uma nova requisição no navegador e recarrega a página do zero. O Link vai fazer o navegador ser gerenciado pelo JavaScript (Single Page Application). Apenas a parte da interface que muda é renderizada, tornando a transição mais instantânea e fluida */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
