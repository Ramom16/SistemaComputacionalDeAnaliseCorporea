import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getApiError } from '../services/api';
import DashboardNavbar from '../components/DashboardNavbar';
import ExercicioItem from '../components/ExercicioItem';
import '../styles/dashboard.css';
import '../styles/meustreinos.css';
import '../styles/detalhestreinos.css';

export default function DetalhesTreino() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [treino, setTreino] = useState(null);
  const [carregado, setCarregado] = useState(false);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;

    api.get(`/treinos/${id}`)
      .then(({ data }) => { if (ativo) setTreino(data.data ?? data); })
      .catch((err) => {
        console.error('Erro ao buscar detalhes do treino:', getApiError(err));
        if (ativo) setErro(true);
      })
      .finally(() => { if (ativo) setCarregado(true); });

    return () => { ativo = false; };
  }, [id]);

  const voltar = () => navigate('/meus-treinos');

  if (!carregado) {
    return (
      <div className="dashboard-layout">
        <DashboardNavbar />
        <main className="dashboard-content" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <h2>Carregando detalhes do treino...</h2>
        </main>
      </div>
    );
  }

  if (erro || !treino) {
    return (
      <div className="dashboard-layout">
        <DashboardNavbar />
        <main className="dashboard-content">
          <div className="treino-nao-encontrado">
            <h2>Treino não encontrado no banco de dados</h2>
            <button className="btn-voltar" onClick={voltar}>← Voltar para Meus Treinos</button>
          </div>
        </main>
      </div>
    );
  }

  // A API pode devolver a lista direta ou agrupada em divisoes (Treino A, Treino B, ...).
  const listaExercicios = treino.treinoExercicios ?? treino.exercicios ?? [];
  const divisoes = Array.isArray(treino.divisao) ? treino.divisao : [];
  const grupos = divisoes.length > 0
    ? divisoes.map((dia, i) => ({ chave: `${dia.nome}-${i}`, titulo: dia.nome, exercicios: dia.exercicios ?? [] }))
    : [{ chave: 'unico', titulo: 'Exercícios do Treino', exercicios: listaExercicios }];

  return (
    <div className="dashboard-layout">
      <DashboardNavbar />
      <main className="dashboard-content">
        <button className="btn-voltar" onClick={voltar}>← Voltar para Meus Treinos</button>

        <div className="detalhe-header">
          <span className="detalhe-objetivo">
            {treino.objetivo || 'Treino'} - Nível: {treino.nivel || 'Não especificado'}
          </span>
          <h1 className="welcome-title" style={{ marginBottom: '0.5rem' }}>
            {treino.titulo || `Treino ${treino.objetivo}`}
          </h1>
          <p className="welcome-desc">
            {treino.descricao || 'Treino personalizado baseado em seu perfil'}
          </p>

          <div className="detalhe-meta">
            <span>Objetivo: {treino.objetivo}</span>
            {treino.data_criacao && (
              <span>Criado em: {new Date(treino.data_criacao).toLocaleDateString('pt-BR')}</span>
            )}
            <span>Total de Exercícios: {listaExercicios.length}</span>
          </div>
        </div>

        {grupos.map((grupo) => (
          <div className="detalhe-card" key={grupo.chave}>
            <h3 className="detalhe-card-titulo">{grupo.titulo}</h3>
            {grupo.exercicios.length > 0 ? (
              <div className="exercicios-lista">
                {grupo.exercicios.map((exercicio, i) => (
                  <ExercicioItem key={exercicio.id ?? i} exercicio={exercicio} numero={i + 1} />
                ))}
              </div>
            ) : (
              <p className="texto-vazio">Nenhum exercício cadastrado para este treino.</p>
            )}
          </div>
        ))}

        <p className="aviso-legal">
          ⚠️ Este treino é uma recomendação inicial baseada no seu perfil. Consulte um profissional
          de educação física para acompanhamento personalizado.
        </p>
      </main>
    </div>
  );
}
