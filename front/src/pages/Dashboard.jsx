import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  // Dados do usuário salvos pelo Login
  const usuarioSalvo = JSON.parse(
    localStorage.getItem('usuario') || '{}'
  );
  const [usuarioNome] = useState(usuarioSalvo.nome || 'Atleta');
  const [idUsuario] = useState(usuarioSalvo.id || null);
  // Estados dos inputs
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState('Masculino');
  const [nivelAtividade, setNivelAtividade] = useState('Sedentario');
  // Resultados
  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({
    text: '',
    type: ''
  });

  // Treinos recomendados
  const [treinosRecomendados, setTreinosRecomendados] = useState([]);
  const [loadingTreinos, setLoadingTreinos] = useState(false);
  // BUSCAR DADOS CORPORAIS EXISTENTES

  useEffect(() => {
    async function buscarDadosExistentes() {
      if (!idUsuario) return;

      try {
        const token = localStorage.getItem('token');

        // Verifica se existe token
        if (!token) {
          console.warn('Token não encontrado no localStorage.');
          return;
        }
        const response = await api.get(
          `/dadosCorporais/usuario/${idUsuario}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const data = response.data;
        // Pega o cálculo mais recente
        if (data.calculos && data.calculos.length > 0) {
          setResultados(data.calculos[0]);
        }
      } catch (err) {
        console.error(
          'Erro ao buscar cálculos salvos:',
          err.response?.data || err
        );
      }
    }
    buscarDadosExistentes();}, [idUsuario]);

  // BUSCAR TREINOS RECOMENDADOS
  const buscarTreinosRecomendados = async () => {
    const token = localStorage.getItem('token');

    if (!token || !resultados) {
      return;
    }

    try {
      setLoadingTreinos(true);

      const response = await api.get('/treinos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const treinos = (
        response.data.data ||
        response.data ||
        []
      ).slice(0, 3);

      setTreinosRecomendados(treinos);

    } catch (err) {
      console.error(
        'Erro ao buscar treinos recomendados:',
        err.response?.data || err
      );
    } finally {
      setLoadingTreinos(false);
    }
  };

  // CALCULAR

  const handleCalcular = async (e) => {
    e.preventDefault();

    setLoading(true);

    setMsg({
      text: '',
      type: ''
    });

    // Pega o token
    const token = localStorage.getItem('token');

    // Se não tiver token, não faz a requisição
    if (!token) {
      setMsg({
        text: 'Sessão expirada. Faça login novamente.',
        type: 'erro'
      });

      setLoading(false);

      return;
    }

    // Dados enviados para o backend
    const payload = {
      idUsuario,
      peso_kg: parseFloat(peso),
      altura_cm: parseFloat(altura),
      idade: parseInt(idade, 10),
      genero: sexo,
      nivel_atividade: nivelAtividade
    };

    try {
      let data;

      // TENTAR CRIAR

      try {
        const response = await api.post(
          '/dadosCorporais',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        data = response.data;

      } catch (postError) {

        // ===================================================
        // SE JÁ EXISTIR, TENTA ATUALIZAR
        // ===================================================

        if (
          postError.response?.data?.erro ===
          'Usuário já possui dados corporais'
        ) {

          const putResponse = await api.put(
            `/dadosCorporais/${idUsuario}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          data = putResponse.data;

        } else {
          throw postError;
        }
      }

      // SUCESSO

      setMsg({
        text: 'Cálculos realizados com sucesso!',
        type: 'sucesso'
      });

      setResultados(data.dados.calculos);

      // Busca treinos depois do cálculo
      setTimeout(() => {
        buscarTreinosRecomendados();
      }, 500);

    } catch (error) {

      console.error(
        'Erro na requisição:',
        error.response?.data || error
      );

      // Se o backend retornar erro
      const mensagemErro =
        error.response?.data?.erro ||
        'Erro ao conectar com a API';

      // Caso seja erro de autenticação
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {

        localStorage.removeItem('token');

        setMsg({
          text: 'Sua sessão expirou. Faça login novamente.',
          type: 'erro'
        });

        return;
      }

      setMsg({
        text: mensagemErro,
        type: 'erro'
      });

    } finally {
      setLoading(false);
    }
  };

  // LOGOUT

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    navigate('/login');
  };

  // INTERFACE

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">

        <Link to="/" className="sidebar-logo">

          <div className="logo-icon">
            <span className="logo-bar"></span>
            <span className="logo-bar"></span>
            <span className="logo-bar"></span>
          </div>

          <span className="logo-text">
            IRONFIT
          </span>

        </Link>

        <nav className="sidebar-nav">

          <Link
            to="/dashboard"
            className="active"
          >
            Análise Corporal
          </Link>

          <Link to="/meus-treinos">
            Meus Treinos
          </Link>

          <Link to="/evolucao">
            Evolução
          </Link>

          <Link to="#">
            Configurações
          </Link>

        </nav>

        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          Sair da Conta
        </button>

      </aside>

      {/* CONTEÚDO */}
      <main className="dashboard-content">

        {/* BOAS-VINDAS */}
        <section className="welcome-section">

          <h1 className="welcome-title">
            Olá, <span>{usuarioNome}</span>
          </h1>

          <p className="welcome-desc">
            Bem-vindo ao sistema! Aqui você vai poder calcular
            seu TMB, IMC e NDC, trabalhar com seus exercícios
            e acompanhar sua evolução física de perto.
          </p>

        </section>

        {/* CALCULADORA */}
        <section className="calculator-section">

          <div className="calc-card">

            <h3>
              Calculadora Metabólica
            </h3>

            <form
              className="form-grid"
              onSubmit={handleCalcular}
            >

              {/* PESO */}
              <div className="input-group">

                <label htmlFor="peso">
                  Peso (kg)
                </label>

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

              {/* ALTURA */}
              <div className="input-group">

                <label htmlFor="altura">
                  Altura (cm)
                </label>

                <input
                  type="number"
                  id="altura"
                  placeholder="Ex: 178"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  required
                />

              </div>

              {/* IDADE */}
              <div className="input-group">

                <label htmlFor="idade">
                  Idade
                </label>

                <input
                  type="number"
                  id="idade"
                  placeholder="Ex: 25"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  required
                />

              </div>

              {/* SEXO */}
              <div className="input-group">

                <label htmlFor="sexo">
                  Sexo Biológico
                </label>

                <select
                  id="sexo"
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  required
                >

                  <option value="Masculino">
                    Masculino
                  </option>

                  <option value="Feminino">
                    Feminino
                  </option>

                  <option value="Outro">
                    Outro
                  </option>

                </select>

              </div>

              {/* ATIVIDADE */}
              <div className="input-group">

                <label htmlFor="atividade">
                  Nível de Atividade Física
                </label>

                <select
                  id="atividade"
                  value={nivelAtividade}
                  onChange={(e) =>
                    setNivelAtividade(e.target.value)
                  }
                  required
                >

                  <option value="Sedentario">
                    Sedentário (Pouco ou nenhum exercício)
                  </option>

                  <option value="Leve">
                    Leve (1 a 3 dias/semana)
                  </option>

                  <option value="Moderado">
                    Moderado (3 a 5 dias/semana)
                  </option>

                  <option value="Intenso">
                    Intenso (6 a 7 dias/semana)
                  </option>

                  <option value="MuitoIntenso">
                    Muito Intenso (Atleta/2x ao dia)
                  </option>

                </select>

              </div>

              {/* BOTÃO */}
              <button
                type="submit"
                className="btn-calc"
                disabled={loading}
              >
                {loading
                  ? 'Calculando...'
                  : 'Calcular'}
              </button>

            </form>

            {/* MENSAGEM */}
            {msg.text && (

              <p
                style={{
                  marginTop: '15px',
                  color:
                    msg.type === 'erro'
                      ? '#ff4d5a'
                      : '#4ade80',
                  fontWeight: 'bold'
                }}
              >
                {msg.text}
              </p>

            )}

          </div>

          {/* RESULTADOS */}
          <div className="results-section">

            {/* TMB */}
            <div className="result-table-card">

              <div className="table-header">

                <h4>
                  Taxa Metabólica Basal
                </h4>

                <span className="table-badge">
                  TMB
                </span>

              </div>

              <div className="table-content">

                <div>

                  <span className="result-value">
                    {resultados
                      ? Math.round(resultados.tmb)
                      : '---'}
                  </span>

                  <span className="result-unit">
                    kcal
                  </span>

                </div>

                <div className="result-desc">
                  Quantidade mínima de energia que seu
                  corpo precisa apenas para manter as
                  funções vitais em repouso.
                </div>

              </div>

            </div>

            {/* IMC */}
            <div className="result-table-card">

              <div className="table-header">

                <h4>
                  Índice de Massa Corporal
                </h4>

                <span className="table-badge">
                  IMC
                </span>

              </div>

              <div className="table-content">

                <div>

                  <span className="result-value">
                    {resultados
                      ? Math.round(
                        resultados.imc * 10
                      ) / 10
                      : '---'}
                  </span>

                </div>

                <div className="result-desc">

                  {resultados?.classificacao_imc ? (

                    <strong
                      style={{
                        color:
                          'var(--primary-yellow)'
                      }}
                    >
                      {resultados.classificacao_imc}
                    </strong>

                  ) : (

                    'Indicador de adequação do peso em relação à altura.'

                  )}

                </div>

              </div>

            </div>

            {/* NDC */}
            <div className="result-table-card">

              <div className="table-header">

                <h4>
                  Necessidade Diária de Calorias
                </h4>

                <span className="table-badge">
                  NDC
                </span>

              </div>

              <div className="table-content">

                <div>

                  <span className="result-value">
                    {resultados
                      ? Math.round(resultados.ndc)
                      : '---'}
                  </span>

                  <span className="result-unit">
                    kcal
                  </span>

                </div>

                <div className="result-desc">

                  Total de calorias gastas no dia.

                  <br />

                  Recomendação de Água:{' '}

                  {resultados
                    ? resultados.agua_diaria_litros
                    : '--'}{' '}

                  Litros

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* TREINOS RECOMENDADOS */}
        {resultados && (

          <section
            className="treinos-recomendados-section"
            style={{
              marginTop: '3rem'
            }}
          >

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}
            >

              <h2
                style={{
                  fontSize: '1.8rem',
                  color: '#fff'
                }}
              >
                💪 Treinos Recomendados para Você
              </h2>

              <Link
                to="/meus-treinos"
                style={{
                  color: 'var(--primary-yellow)',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Ver todos →
              </Link>

            </div>

            {loadingTreinos ? (

              <p
                style={{
                  textAlign: 'center',
                  color: '#aaa'
                }}
              >
                Carregando treinos personalizados...
              </p>

            ) : treinosRecomendados.length > 0 ? (

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.5rem'
                }}
              >

                {treinosRecomendados.map((treino) => (

                  <div
                    key={
                      treino.idTreino ||
                      treino.id
                    }
                    style={{
                      background:
                        'linear-gradient(135deg, #1e1e2e 0%, #2d2d3d 100%)',
                      border:
                        '1px solid var(--primary-yellow)',
                      borderRadius: '8px',
                      padding: '1.5rem',
                      cursor: 'pointer',
                      transition:
                        'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(-5px)';

                      e.currentTarget.style.boxShadow =
                        '0 5px 15px rgba(245, 195, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(0)';

                      e.currentTarget.style.boxShadow =
                        'none';
                    }}
                    onClick={() =>
                      navigate(
                        `/treino/${treino.idTreino || treino.id}`
                      )
                    }>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        alignItems: 'start',
                        marginBottom: '1rem'
                      }}
                    >

                      <h3
                        style={{
                          fontSize: '1.2rem',
                          color: '#fff',
                          margin: 0
                        }}
                      >
                        {treino.titulo || `Treino ${treino.objetivo}`}
                      </h3>

                      <span
                        style={{
                          background:
                            'var(--primary-yellow)',
                          color: '#000',
                          padding:
                            '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {treino.objetivo || 'Geral'}
                      </span>

                    </div>

                    <p
                      style={{
                        color: '#aaa',
                        margin: '0.5rem 0',
                        fontSize: '0.9rem'
                      }}
                    >
                      {treino.descricao || 'Treino personalizado para seu perfil'}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        marginTop: '1rem',
                        color: '#888',
                        fontSize: '0.85rem'
                      }}
                    >

                      <span>🎯 {treino.nivel || 'Iniciante'}
                      </span>

                      {treino.treinoExercicios && (
                        <span>💪{' '}{treino.treinoExercicios.length}{' '}exercícios</span>
                      )}
                    </div>
                  </div>

                ))}

              </div>

            ) : (
              <p
                style={{
                  textAlign: 'center',
                  color: '#aaa'
                }}
              >
                Nenhum treino disponível no momento.
                {' '}
                <Link
                  to="/meus-treinos"
                  style={{
                    color:
                      'var(--primary-yellow)'
                  }}
                >
                  Confira todos os treinos
                </Link>
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

