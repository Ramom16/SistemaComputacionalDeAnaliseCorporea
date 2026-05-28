import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  // Lê os dados reais do usuário salvos pelo Login
  const usuarioSalvo = JSON.parse(localStorage.getItem('usuario') || '{}');
  const [usuarioNome] = useState(usuarioSalvo.nome || 'Atleta');
  const [idUsuario] = useState(usuarioSalvo.id || null);

  // Estados para os inputs
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState('Masculino');
  const [nivelAtividade, setNivelAtividade] = useState('Sedentario');

  // Estado para armazenar os resultados da API
  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Tenta buscar se o usuário já tem dados cadastrados ao carregar a página
  useEffect(() => {
    async function buscarDadosExistentes() {
      try {
        const response = await fetch(`http://localhost:3000/dadosCorporais/usuario/${idUsuario}`);
        // Note: A rota atual no backend é GET /dadosCorporais/ passando id? Ou GET /dadosCorporais/:idDados?
        // Em dadosRoutes.js a rota buscarPorUsuario está mapeada como GET "/" (conflita com listar).
        // Por via das dúvidas, vamos apenas aguardar o envio do formulário, ou assumir vazio inicialmente.
      } catch (err) {
        // ignora
      }
    }
    // buscarDadosExistentes();
  }, [idUsuario]);

  const handleCalcular = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });

    const payload = {
      idUsuario,
      peso_kg: parseFloat(peso),
      altura_cm: parseFloat(altura),
      idade: parseInt(idade, 10),
      genero: sexo, // Mapeia sexo para genero (como esperado no controller)
      nivel_atividade: nivelAtividade
    };

    try {
      // 1. Primeiro tentamos criar (POST)
      let response = await fetch('http://localhost:3000/dadosCorporais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let data = await response.json();

      // 2. Se retornar erro informando que já existe, tentamos atualizar (PUT)
      if (!response.ok && data.erro === 'Usuário já possui dados corporais') {
        response = await fetch(`http://localhost:3000/dadosCorporais/${idUsuario}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        data = await response.json();
      }

      if (!response.ok) {
        setMsg({ text: data.erro || 'Erro ao calcular', type: 'erro' });
        setLoading(false);
        return;
      }

      setMsg({ text: 'Cálculos realizados com sucesso!', type: 'sucesso' });
      setResultados(data.dados.calculos);

    } catch (error) {
      console.error(error);
      setMsg({ text: 'Erro ao conectar com a API', type: 'erro' });
    } finally {
      setLoading(false);
    }
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
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
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
                  <option value="Sedentario">Sedentário (Pouco ou nenhum exercício)</option>
                  <option value="Leve">Leve (1 a 3 dias/semana)</option>
                  <option value="Moderado">Moderado (3 a 5 dias/semana)</option>
                  <option value="Intenso">Intenso (6 a 7 dias/semana)</option>
                  <option value="MuitoIntenso">Muito Intenso (Atleta/2x ao dia)</option>
                </select>
              </div>

              <button type="submit" className="btn-calc" disabled={loading}>
                {loading ? 'Calculando...' : 'Calcular'}
              </button>
            </form>
            
            {msg.text && (
              <p style={{ marginTop: '15px', color: msg.type === 'erro' ? '#ff4d5a' : '#4ade80', fontWeight: 'bold' }}>
                {msg.text}
              </p>
            )}
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
                  <span className="result-value">
                    {resultados ? Math.round(resultados.tmb) : '---'}
                  </span>
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
                  <span className="result-value">
                    {resultados ? (Math.round(resultados.imc * 10) / 10) : '---'}
                  </span>
                  <span className="result-unit"></span>
                </div>
                <div className="result-desc">
                  {resultados?.classificacao_imc 
                    ? <strong style={{color: 'var(--primary-yellow)'}}>{resultados.classificacao_imc}</strong> 
                    : 'Indicador de adequação do peso em relação à altura.'}
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
                  <span className="result-value">
                    {resultados ? Math.round(resultados.ndc) : '---'}
                  </span>
                  <span className="result-unit">kcal</span>
                </div>
                <div className="result-desc">
                  Total de calorias gastas no dia. (Recomendação de Água: {resultados ? resultados.agua_diaria_litros : '--'} Litros)
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
