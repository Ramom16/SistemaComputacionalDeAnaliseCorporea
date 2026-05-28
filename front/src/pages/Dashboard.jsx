import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  // Simulando o nome do usuário logado (depois você pode pegar isso do localStorage/API)
  const [usuarioNome] = useState('Atleta');

  // Estados para os inputs
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState('masculino');
  const [nivelAtividade, setNivelAtividade] = useState('sedentario');

  // Função dummy para quando você for integrar a API
  const handleCalcular = (e) => {
    e.preventDefault();
    console.log("Valores para enviar à API:", { peso, altura, idade, sexo, nivelAtividade });
    // Aqui você fará o fetch para a sua API e atualizará estados com os resultados reais
  };

  const handleLogout = () => {
    // Lógica de logout (limpar localStorage, etc)
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar de Navegação */}
      <aside className="dashboard-sidebar">
        <Link to="/" className="sidebar-logo">
          <div className="logo-icon">
            <span className="logo-bar"></span>
            <span className="logo-bar"></span>
            <span className="logo-bar"></span>
          </div>
          <span className="logo-text">IRONFIT</span>
        </Link>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="active">Análise Corporal</Link>
          <Link to="#">Meus Treinos</Link>
          <Link to="#">Evolução</Link>
          <Link to="#">Configurações</Link>
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          Sair da Conta
        </button>
      </aside>

      {/* Conteúdo Principal */}
      <main className="dashboard-content">
        <section className="welcome-section">
          <h1 className="welcome-title">Olá, <span>{usuarioNome}</span></h1>
          <p className="welcome-desc">
            Bem-vindo ao sistema! Aqui você vai poder calcular seu TMB, IMC e NDC, trabalhar com seus exercícios e acompanhar sua evolução física de perto.
          </p>
        </section>

        <section className="calculator-section">
          {/* Card do Formulário */}
          <div className="calc-card">
            <h3>Calculadora Metabólica</h3>
            <form className="form-grid" onSubmit={handleCalcular}>
              
              <div className="input-group">
                <label htmlFor="peso">Peso (kg)</label>
                <input 
                  type="number" 
                  id="peso" 
                  step="0.1"
                  placeholder="Ex: 75.5" 
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  required 
                />
              </div>

              <div className="input-group">
                <label htmlFor="altura">Altura (cm)</label>
                <input 
                  type="number" 
                  id="altura" 
                  placeholder="Ex: 178" 
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  required 
                />
              </div>

              <div className="input-group">
                <label htmlFor="idade">Idade</label>
                <input 
                  type="number" 
                  id="idade" 
                  placeholder="Ex: 25" 
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  required 
                />
              </div>

              <div className="input-group">
                <label htmlFor="sexo">Sexo Biológico</label>
                <select 
                  id="sexo"
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  required
                >
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="atividade">Nível de Atividade Física</label>
                <select 
                  id="atividade"
                  value={nivelAtividade}
                  onChange={(e) => setNivelAtividade(e.target.value)}
                  required
                >
                  <option value="sedentario">Sedentário (Pouco ou nenhum exercício)</option>
                  <option value="leve">Leve (1 a 3 dias/semana)</option>
                  <option value="moderado">Moderado (3 a 5 dias/semana)</option>
                  <option value="intenso">Intenso (6 a 7 dias/semana)</option>
                  <option value="muito_intenso">Muito Intenso (Atleta/2x ao dia)</option>
                </select>
              </div>

              <button type="submit" className="btn-calc">Calcular</button>
            </form>
          </div>

          {/* Seção de Resultados (3 Tabelas/Cards) */}
          <div className="results-section">
            
            {/* Resultado TMB */}
            <div className="result-table-card">
              <div className="table-header">
                <h4>Taxa Metabólica Basal</h4>
                <span className="table-badge">TMB</span>
              </div>
              <div className="table-content">
                <div>
                  <span className="result-value">---</span>
                  <span className="result-unit">kcal</span>
                </div>
                <div className="result-desc">
                  Quantidade mínima de energia que seu corpo precisa apenas para manter as funções vitais em repouso.
                </div>
              </div>
            </div>

            {/* Resultado IMC */}
            <div className="result-table-card">
              <div className="table-header">
                <h4>Índice de Massa Corporal</h4>
                <span className="table-badge">IMC</span>
              </div>
              <div className="table-content">
                <div>
                  <span className="result-value">---</span>
                  <span className="result-unit"></span>
                </div>
                <div className="result-desc">
                  Indicador de adequação do peso em relação à altura (Ex: Normal, Sobrepeso, etc).
                </div>
              </div>
            </div>

            {/* Resultado NDC */}
            <div className="result-table-card">
              <div className="table-header">
                <h4>Necessidade Diária de Calorias</h4>
                <span className="table-badge">NDC</span>
              </div>
              <div className="table-content">
                <div>
                  <span className="result-value">---</span>
                  <span className="result-unit">kcal</span>
                </div>
                <div className="result-desc">
                  Total de calorias que você gasta no dia, considerando seu nível de atividade física. Use isso como base para dietas.
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
