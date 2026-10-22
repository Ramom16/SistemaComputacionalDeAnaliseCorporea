import { useEvolucao } from '../../hooks/useEvolucao';
import { useMetas } from '../../hooks/useMetas';
import DashboardNavbar from '../../components/layout/DashboardNavbar';
import { getUsuario } from '../../services/auth';
import { Skeleton } from '../../components/ui/Skeleton';

import Header from '../../components/evolucao/Header';
import ResumoBiometrico from '../../components/evolucao/ResumoBiometrico';
import DashboardCards from '../../components/evolucao/DashboardCards';
import EvolucaoGrafico from '../../components/evolucao/EvolucaoGrafico';
import ExerciciosGrafico from '../../components/evolucao/ExercicioGrafico';
import GrupoMuscularGrafico from '../../components/evolucao/GrupoMuscularGrafico';
import Recordes from '../../components/evolucao/Records';
import CalendarioTreinos from '../../components/evolucao/CalendarioTreinos';
import HistoricoTabela from '../../components/evolucao/HistoricoTabela';
import CardsCompartilhamento from '../../components/evolucao/CardsCompartilhamento';
import MetasEditor from '../../components/evolucao/MetasEditor';
import RelatorioPdf from '../../components/evolucao/RelatorioPdf';

import '../../styles/dashboard.css';
import '../../styles/evolucao.css';

export default function Evolucao() {
  const { loading, erro, cards, detalhesCorporais, historico, exercicios, grupos, recordes } = useEvolucao();
  const usuario = getUsuario();
  const { metas, salvar } = useMetas(usuario.id);

  if (loading) {
    return (
      <>
        <DashboardNavbar />
        <div className="dashboard-layout">
          <main className="dashboard-content">
            <Skeleton variante="titulo" largura="240px" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 24 }}>
              {Array.from({ length: 4 }).map((_, indice) => (
                <Skeleton key={indice} variante="retangulo" altura="120px" />
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <Skeleton variante="retangulo" altura="320px" />
            </div>
          </main>
        </div>
      </>
    );
  }
  if (erro) return <div className="loading" role="alert">{erro}</div>;

  return (
    <>
      <DashboardNavbar />
      <div className="dashboard-layout">
        <main className="dashboard-content">
          <Header />

          {/* Painel Biométrico e Metabólico Enriquecido */}
          <ResumoBiometrico detalhes={detalhesCorporais} />

          {/* Cards de Frequência e Atividades */}
          <DashboardCards cards={cards} />

          {/* Editor de Metas Corporais e de Treino */}
          <MetasEditor metas={metas} onSalvar={salvar} />

          {/* Download do Relatório Completo em PDF */}
          <RelatorioPdf
            usuario={usuario}
            historico={historico}
            cards={cards}
            metas={metas}
            detalhesCorporais={detalhesCorporais}
          />

          <CardsCompartilhamento
            historico={historico}
            cards={cards}
            nome={getUsuario().nome}
          />

          {/* Gráficos com Curvas de Gradiente, KPIs e Linha de Meta */}
          <div className="graficos-grid">
            <EvolucaoGrafico dados={historico} metas={metas} />
            <ExerciciosGrafico dados={exercicios} />
            <GrupoMuscularGrafico dados={grupos} />
          </div>

          <Recordes dados={recordes} />

          <CalendarioTreinos dados={historico} recordes={recordes} />

          <HistoricoTabela dados={historico} />
        </main>
      </div>
    </>
  );
}
