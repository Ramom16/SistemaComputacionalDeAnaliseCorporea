import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import api from '../services/api';
import '../styles/dashboard.css';
import '../styles/meustreinos.css';

export default function CriarTreino() {
  const navigate = useNavigate();

  // Estado do treino
  const [treino, setTreino] = useState({
    titulo: '',
    objetivo: 'Hipertrofia',
    descricao: '',
    is_oficial: true,
  });

  // Estado dos exercícios
  const [exercicios, setExercicios] = useState([
    {
      nome: '',
      grupo_muscular: 'Peito',
      series: 3,
      repeticoes: 10,
      descanso_segundos: 60,
      caminho_video: ''
    }
  ]);

  // Estados da UI
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Grupos musculares disponíveis
  const grupos = [
    'Peito',
    'Costas',
    'Ombros',
    'Braços',
    'Antebraços',
    'Coxas',
    'Pernas',
    'Glúteos',
    'Abdômen',
    'Cardio'
  ];

  const objetivos = [
    'Hipertrofia',
    'Emagrecimento',
    'Resistencia',
    'Condicionamento'
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const handleTreinoChange = (e) => {
    const { name, value } = e.target;
    setTreino(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExercicioChange = (index, field, value) => {
    const novoExercicios = [...exercicios];
    novoExercicios[index][field] = value;
    setExercicios(novoExercicios);
  };

  const adicionarExercicio = () => {
    setExercicios(prev => [
      ...prev,
      {
        nome: '',
        grupo_muscular: 'Peito',
        series: 3,
        repeticoes: 10,
        descanso_segundos: 60,
        caminho_video: ''
      }
    ]);
  };

  const removerExercicio = (index) => {
    if (exercicios.length > 1) {
      setExercicios(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações
    if (!treino.titulo.trim()) {
      setErro('Nome do treino é obrigatório');
      return;
    }

    if (exercicios.some(ex => !ex.nome.trim())) {
      setErro('Todos os exercícios precisam de um nome');
      return;
    }

    try {
      setLoading(true);
      setErro('');
      setSucesso('');

      // 1. Criar o treino
      const treinoResponse = await api.post('/treinos', {
        titulo: treino.titulo,
        objetivo: treino.objetivo,
        descricao: treino.descricao,
        is_oficial: true,
        nivel: 'Iniciante'
      });

      const idTreino = treinoResponse.data.data.idTreino;

      // 2. Adicionar exercícios ao treino
      if (exercicios.length > 0) {
        const exerciciosPayload = exercicios.map(ex => ({
          nome: ex.nome,
          grupo_muscular: ex.grupo_muscular,
          caminho_video: ex.caminho_video || null,
          serie: ex.series,
          repeticoes: ex.repeticoes,
          descanso_segundos: ex.descanso_segundos,
          tipo: 'Força' // tipo padrão
        }));

        await api.post(`/treinos/${idTreino}/exercicios`, exerciciosPayload);
      }

      setSucesso('Treino global criado com sucesso!');
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/meus-treinos');
      }, 2000);

    } catch (error) {
      console.error('Erro ao criar treino:', error);
      const mensagem = error.response?.data?.error || error.message || 'Erro ao criar treino';
      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardNavbar onLogout={handleLogout} />
      <div className="dashboard-layout">
        <main className="dashboard-content">
          <section className="welcome-section">
            <h1 className="welcome-title">
              Criar <span>Treino Global</span>
            </h1>
            <p className="welcome-desc">
              Crie um novo treino que será visível para todos os usuários do IronFit.
            </p>
          </section>

          <form onSubmit={handleSubmit} className="criar-treino-form">
            {/* Mensagens de Feedback */}
            {erro && (
              <div style={{
                background: 'rgba(255, 77, 90, 0.15)',
                border: '1px solid #ff4d5a',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#ff6b75',
                marginBottom: '20px'
              }}>
                {erro}
              </div>
            )}

            {sucesso && (
              <div style={{
                background: 'rgba(76, 175, 80, 0.15)',
                border: '1px solid #4caf50',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#4caf50',
                marginBottom: '20px'
              }}>
                {sucesso}
              </div>
            )}

            {/* SEÇÃO: Informações do Treino */}
            <div className="calc-card" style={{ marginBottom: '30px' }}>
              <h3>Informações do Treino</h3>

              {/* Nome do Treino */}
              <div className="input-group">
                <label htmlFor="titulo">Nome do Treino *</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  placeholder="Ex: Treino A - Peito e Tríceps"
                  value={treino.titulo}
                  onChange={handleTreinoChange}
                  required
                />
              </div>

              {/* Objetivo */}
              <div className="input-group">
                <label htmlFor="objetivo">Objetivo / Categoria *</label>
                <select
                  id="objetivo"
                  name="objetivo"
                  value={treino.objetivo}
                  onChange={handleTreinoChange}
                  required
                >
                  {objetivos.map(obj => (
                    <option key={obj} value={obj}>{obj}</option>
                  ))}
                </select>
              </div>

              {/* Descrição */}
              <div className="input-group">
                <label htmlFor="descricao">Descrição / Instruções</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Ex: Este treino é focado em ganho de massa muscular..."
                  value={treino.descricao}
                  onChange={handleTreinoChange}
                  rows={4}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    color: 'var(--text-white)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            {/* SEÇÃO: Exercícios */}
            <div className="calc-card" style={{ marginBottom: '30px' }}>
              <h3>Exercícios do Treino</h3>

              {exercicios.map((exercicio, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{ margin: 0, color: 'var(--primary-yellow)' }}>
                      Exercício {index + 1}
                    </h4>
                    {exercicios.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerExercicio(index)}
                        style={{
                          background: 'rgba(255, 77, 90, 0.2)',
                          color: '#ff4d5a',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '500'
                        }}
                      >
                        Remover
                      </button>
                    )}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    {/* Nome do Exercício */}
                    <div className="input-group">
                      <label>Nome do Exercício *</label>
                      <input
                        type="text"
                        placeholder="Ex: Supino Reto"
                        value={exercicio.nome}
                        onChange={(e) => handleExercicioChange(index, 'nome', e.target.value)}
                        required
                      />
                    </div>

                    {/* Grupo Muscular */}
                    <div className="input-group">
                      <label>Grupo Muscular</label>
                      <select
                        value={exercicio.grupo_muscular}
                        onChange={(e) => handleExercicioChange(index, 'grupo_muscular', e.target.value)}
                      >
                        {grupos.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    {/* Séries */}
                    <div className="input-group">
                      <label>Séries</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={exercicio.series}
                        onChange={(e) => handleExercicioChange(index, 'series', parseInt(e.target.value))}
                      />
                    </div>

                    {/* Repetições */}
                    <div className="input-group">
                      <label>Repetições</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={exercicio.repeticoes}
                        onChange={(e) => handleExercicioChange(index, 'repeticoes', parseInt(e.target.value))}
                      />
                    </div>

                    {/* Descanso */}
                    <div className="input-group">
                      <label>Descanso (segundos)</label>
                      <input
                        type="number"
                        min="0"
                        max="600"
                        value={exercicio.descanso_segundos}
                        onChange={(e) => handleExercicioChange(index, 'descanso_segundos', parseInt(e.target.value))}
                      />
                    </div>

                    {/* URL do Vídeo */}
                    <div className="input-group">
                      <label>URL do Vídeo (YouTube/MP4)</label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/..."
                        value={exercicio.caminho_video}
                        onChange={(e) => handleExercicioChange(index, 'caminho_video', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Botão Adicionar Exercício */}
              <button
                type="button"
                onClick={adicionarExercicio}
                style={{
                  background: 'rgba(255, 230, 0, 0.15)',
                  color: 'var(--primary-yellow)',
                  border: '1px solid rgba(255, 230, 0, 0.3)',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  width: '100%',
                  transition: 'all 0.3s'
                }}
              >
                + Adicionar Exercício
              </button>
            </div>

            {/* Botões de Ação */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={() => navigate('/meus-treinos')}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-white)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-calc"
                style={{
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Criando...' : 'Criar Treino Global'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
