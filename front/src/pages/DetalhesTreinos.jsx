import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../styles/dashboard.css';
import '../styles/meustreinos.css'
import '../styles/detalhestreinos.css';

// Base completa de treinos com exercícios
const TREINOS_DETALHES = {
  1: {
    titulo: 'Hipertrofia — Iniciante',
    objetivo: 'Hipertrofia',
    experiencia: 'Iniciante',
    faixaEtaria: 'Todas',
    dias: '3x por semana',
    descricao: 'Treino Full Body para iniciantes. Foco em aprender a técnica dos movimentos com segurança.',
    caracteristicas: [
      'Foco em técnica de execução',
      'Evitar falha muscular',
      'Descanso de 60–90 segundos entre séries',
      'Progressão de carga lenta e gradual',
      'Movimentos controlados',
    ],
    divisao: [
      {
        nome: 'Treino A',
        exercicios: [
          { nome: 'Leg Press', series: 3, repeticoes: '10–12', video: 'https://www.youtube.com/embed/IZxyjW7MPJQ' },
          { nome: 'Supino Máquina', series: 3, repeticoes: '10–12', video: 'https://www.youtube.com/embed/xUm0BiZCX_g' },
          { nome: 'Puxador Alto', series: 3, repeticoes: '10–12', video: 'https://www.youtube.com/embed/CAwf7n6Luuc' },
          { nome: 'Desenvolvimento Máquina', series: 2, repeticoes: '12', video: 'https://www.youtube.com/embed/qEwKCR5JCog' },
          { nome: 'Tríceps Polia', series: 2, repeticoes: '12', video: 'https://www.youtube.com/embed/2-LAMcpzODU' },
          { nome: 'Rosca Scott Máquina', series: 2, repeticoes: '12', video: 'https://www.youtube.com/embed/i7F5pHPNoEs' },
          { nome: 'Prancha', series: 3, repeticoes: '30–45 seg', video: 'https://www.youtube.com/embed/ASdvN_XEl_c' },
        ],
      },
      {
        nome: 'Treino B',
        exercicios: [
          { nome: 'Agachamento Goblet', series: 3, repeticoes: '10', video: 'https://www.youtube.com/embed/MeIiIdhvXT4' },
          { nome: 'Mesa Flexora', series: 3, repeticoes: '12', video: 'https://www.youtube.com/embed/1Tq3QdYUuHs' },
          { nome: 'Remada Baixa', series: 3, repeticoes: '10–12', video: 'https://www.youtube.com/embed/GZbfZ033f74' },
          { nome: 'Supino Inclinado Máquina', series: 3, repeticoes: '10', video: 'https://www.youtube.com/embed/xUm0BiZCX_g' },
          { nome: 'Elevação Lateral', series: 2, repeticoes: '15', video: 'https://www.youtube.com/embed/3VcKaXpzqRo' },
          { nome: 'Panturrilha', series: 3, repeticoes: '15', video: 'https://www.youtube.com/embed/gwLzBJYoWlI' },
        ],
      },
    ],
  },
  2: {
    titulo: 'Hipertrofia — Intermediário',
    objetivo: 'Hipertrofia',
    experiencia: 'Intermediário',
    faixaEtaria: '18–40 anos',
    dias: '4x por semana',
    descricao: 'Divisão de 4 dias com foco em hipertrofia. Progressão de carga e técnicas de intensidade.',
    caracteristicas: [
      'Progressão de carga semanal',
      'Falha muscular apenas na última série',
      'Drop Set e Rest Pause permitidos',
      'Volume de 10–20 séries por músculo/semana',
      'Descanso de 60–120 segundos',
    ],
    divisao: [
      {
        nome: 'Dia 1 — Peito + Tríceps',
        exercicios: [
          { nome: 'Supino Inclinado', series: 4, repeticoes: '8–12', video: 'https://www.youtube.com/embed/xUm0BiZCX_g' },
          { nome: 'Crucifixo Máquina', series: 3, repeticoes: '10–15', video: 'https://www.youtube.com/embed/xUm0BiZCX_g' },
          { nome: 'Crossover', series: 3, repeticoes: '12–15', video: 'https://www.youtube.com/embed/taI4XduLpTk' },
          { nome: 'Tríceps Polia', series: 4, repeticoes: '10–12', video: 'https://www.youtube.com/embed/2-LAMcpzODU' },
          { nome: 'Tríceps Francês', series: 3, repeticoes: '10–12', video: 'https://www.youtube.com/embed/d_KZxkY_0cM' },
        ],
      },
      {
        nome: 'Dia 2 — Costas + Bíceps',
        exercicios: [
          { nome: 'Puxador Alto', series: 4, repeticoes: '8–12', video: 'https://www.youtube.com/embed/CAwf7n6Luuc' },
          { nome: 'Remada Unilateral', series: 3, repeticoes: '10', video: 'https://www.youtube.com/embed/GZbfZ033f74' },
          { nome: 'Remada Baixa', series: 3, repeticoes: '10', video: 'https://www.youtube.com/embed/GZbfZ033f74' },
          { nome: 'Rosca Barra W', series: 3, repeticoes: '10', video: 'https://www.youtube.com/embed/i7F5pHPNoEs' },
          { nome: 'Rosca Scott', series: 3, repeticoes: '10', video: 'https://www.youtube.com/embed/i7F5pHPNoEs' },
          { nome: 'Rosca Martelo', series: 3, repeticoes: '12', video: 'https://www.youtube.com/embed/i7F5pHPNoEs' },
        ],
      },
      {
        nome: 'Dia 3 — Pernas',
        exercicios: [
          { nome: 'Leg Press', series: 4, repeticoes: '10', video: 'https://www.youtube.com/embed/IZxyjW7MPJQ' },
          { nome: 'Extensora', series: 3, repeticoes: '12', video: 'https://www.youtube.com/embed/YyvSfVjQeL0' },
          { nome: 'Stiff', series: 3, repeticoes: '10', video: 'https://www.youtube.com/embed/1Tq3QdYUuHs' },
          { nome: 'Mesa Flexora', series: 3, repeticoes: '12', video: 'https://www.youtube.com/embed/1Tq3QdYUuHs' },
          { nome: 'Elevação Pélvica', series: 3, repeticoes: '12', video: 'https://www.youtube.com/embed/SEdqd1n0cvg' },
          { nome: 'Panturrilha', series: 4, repeticoes: '15', video: 'https://www.youtube.com/embed/gwLzBJYoWlI' },
        ],
      },
      {
        nome: 'Dia 4 — Ombro + Abdômen',
        exercicios: [
          { nome: 'Desenvolvimento', series: 3, repeticoes: '10', video: 'https://www.youtube.com/embed/qEwKCR5JCog' },
          { nome: 'Elevação Lateral', series: 4, repeticoes: '15', video: 'https://www.youtube.com/embed/3VcKaXpzqRo' },
          { nome: 'Crucifixo Inverso', series: 3, repeticoes: '15', video: 'https://www.youtube.com/embed/3VcKaXpzqRo' },
          { nome: 'Abdominal Polia', series: 3, repeticoes: '15', video: 'https://www.youtube.com/embed/ASdvN_XEl_c' },
          { nome: 'Elevação de Pernas', series: 3, repeticoes: '15', video: 'https://www.youtube.com/embed/ASdvN_XEl_c' },
        ],
      },
    ],
  },
  6: {
    titulo: 'Emagrecimento',
    objetivo: 'Emagrecimento',
    experiencia: 'Qualquer',
    faixaEtaria: 'Todas',
    dias: '3x por semana',
    descricao: 'Circuito Full Body com cardio para maximizar o gasto calórico e promover o emagrecimento saudável.',
    caracteristicas: [
      '3–4 voltas no circuito',
      'Descanso de 30–45 segundos entre exercícios',
      '20–40 minutos de cardio após o treino',
      'Manter a frequência cardíaca elevada',
      'Priorizar execução correta',
    ],
    divisao: [
      {
        nome: 'Circuito Full Body',
        exercicios: [
          { nome: 'Leg Press', series: 3, repeticoes: '15', video: 'https://www.youtube.com/embed/IZxyjW7MPJQ' },
          { nome: 'Supino Máquina', series: 3, repeticoes: '15', video: 'https://www.youtube.com/embed/xUm0BiZCX_g' },
          { nome: 'Remada Baixa', series: 3, repeticoes: '15', video: 'https://www.youtube.com/embed/GZbfZ033f74' },
          { nome: 'Desenvolvimento Máquina', series: 3, repeticoes: '15', video: 'https://www.youtube.com/embed/qEwKCR5JCog' },
          { nome: 'Mesa Flexora', series: 3, repeticoes: '15', video: 'https://www.youtube.com/embed/1Tq3QdYUuHs' },
          { nome: 'Prancha', series: 3, repeticoes: '30–45 seg', video: 'https://www.youtube.com/embed/ASdvN_XEl_c' },
        ],
      },
      {
        nome: 'Cardio',
        exercicios: [
          { nome: 'Esteira ou Bicicleta Ergométrica', series: 1, repeticoes: '20–40 min', video: null },
        ],
      },
    ],
  },
  7: {
    titulo: 'Manutenção',
    objetivo: 'Manutenção',
    experiencia: 'Qualquer',
    faixaEtaria: 'Todas',
    dias: '3x por semana',
    descricao: 'Full Body moderado para manter o condicionamento atual. Volume equilibrado com cardio leve.',
    caracteristicas: [
      'Volume moderado por sessão',
      'Descanso de 60–90 segundos',
      'Cardio leve 2x por semana',
      'Progressão de carga estável',
      'Foco em manutenção da massa muscular',
    ],
    divisao: [
      {
        nome: 'Treino Full Body',
        exercicios: [
          { nome: 'Leg Press', series: 3, repeticoes: '12', video: 'https://www.youtube.com/embed/IZxyjW7MPJQ' },
          { nome: 'Supino Máquina', series: 3, repeticoes: '12', video: 'https://www.youtube.com/embed/xUm0BiZCX_g' },
          { nome: 'Puxador Alto', series: 3, repeticoes: '12', video: 'https://www.youtube.com/embed/CAwf7n6Luuc' },
          { nome: 'Desenvolvimento Máquina', series: 3, repeticoes: '12', video: 'https://www.youtube.com/embed/qEwKCR5JCog' },
          { nome: 'Rosca Scott', series: 2, repeticoes: '12', video: 'https://www.youtube.com/embed/i7F5pHPNoEs' },
          { nome: 'Tríceps Polia', series: 2, repeticoes: '12', video: 'https://www.youtube.com/embed/2-LAMcpzODU' },
          { nome: 'Prancha', series: 3, repeticoes: '30–45 seg', video: 'https://www.youtube.com/embed/ASdvN_XEl_c' },
        ],
      },
    ],
  },
};

export default function DetalhesTreino() {
  const navigate = useNavigate();
  const { id } = useParams();
  const treino = TREINOS_DETALHES[Number(id)];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  if (!treino) {
    return (
      <div className="dashboard-layout">
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
            <Link to="/dashboard">Análise Corporal</Link>
            <Link to="/meus-treinos" className="active">Meus Treinos</Link>
            <Link to="#">Evolução</Link>
            <Link to="#">Configurações</Link>
          </nav>
          <button onClick={handleLogout} className="logout-btn">Sair da Conta</button>
        </aside>
        <main className="dashboard-content">
          <div className="treino-nao-encontrado">
            <h2>Treino não encontrado</h2>
            <button className="btn-voltar" onClick={() => navigate('/meus-treinos')}>
              ← Voltar para Meus Treinos
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
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
          <Link to="/dashboard">Análise Corporal</Link>
          <Link to="/meus-treinos" className="active">Meus Treinos</Link>
          <Link to="#">Evolução</Link>
          <Link to="#">Configurações</Link>
        </nav>
        <button onClick={handleLogout} className="logout-btn">Sair da Conta</button>
      </aside>

      <main className="dashboard-content">
        <button className="btn-voltar" onClick={() => navigate('/meus-treinos')}>
          ← Voltar para Meus Treinos
        </button>

        {/* Header do treino */}
        <div className="detalhe-header">
          <span className="detalhe-objetivo">{treino.objetivo}</span>
          <h1 className="welcome-title" style={{ marginBottom: '0.5rem' }}>
            {treino.titulo.split('—')[0]}
            <span>{treino.titulo.includes('—') ? `— ${treino.titulo.split('—')[1]}` : ''}</span>
          </h1>
          <p className="welcome-desc">{treino.descricao}</p>

          <div className="detalhe-meta">
            <span>📅 {treino.dias}</span>
            <span>👤 {treino.experiencia}</span>
            <span>🎯 {treino.faixaEtaria}</span>
          </div>
        </div>

        {/* Características */}
        <div className="detalhe-card">
          <h3 className="detalhe-card-titulo">Características do Treino</h3>
          <ul className="caracteristicas-lista">
            {treino.caracteristicas.map((c, i) => (
              <li key={i}><span className="check">✔</span> {c}</li>
            ))}
          </ul>
        </div>

        {/* Divisão de treinos */}
        {treino.divisao.map((dia, diaIdx) => (
          <div key={diaIdx} className="detalhe-card">
            <h3 className="detalhe-card-titulo">{dia.nome}</h3>
            <div className="exercicios-lista">
              {dia.exercicios.map((ex, exIdx) => (
                <div key={exIdx} className="exercicio-item">
                  <div className="exercicio-info">
                    <span className="exercicio-numero">{String(exIdx + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="exercicio-nome">{ex.nome}</p>
                      <p className="exercicio-meta">{ex.series} séries × {ex.repeticoes}</p>
                    </div>
                  </div>
                  {ex.video && (
                    <div className="exercicio-video">
                      <iframe
                        src={ex.video}
                        title={ex.nome}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className="aviso-legal">
          ⚠️ Este treino é uma recomendação inicial baseada no seu perfil. Consulte um profissional de educação física para acompanhamento personalizado.
        </p>
      </main>
    </div>
  );
}
