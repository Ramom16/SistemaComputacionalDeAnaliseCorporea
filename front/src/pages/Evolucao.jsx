import { useEvolucao } from '../hooks/useEvolucao';
import { useMetas } from '../hooks/useMetas';
import DashboardNavbar from '../components/DashboardNavbar';
import { getUsuario } from '../services/auth';
import { Skeleton } from '../components/Skeleton';

import Header from '../components/evolucao/Header';
import DashboardCards from '../components/evolucao/DashboardCards';
import EvolucaoGrafico from '../components/evolucao/EvolucaoGrafico';
import ExerciciosGrafico from '../components/evolucao/ExercicioGrafico';
import GrupoMuscularGrafico from '../components/evolucao/GrupoMuscularGrafico';
import Recordes from '../components/evolucao/Records';
import CalendarioTreinos from '../components/evolucao/CalendarioTreinos';
import HistoricoTabela from '../components/evolucao/HistoricoTabela';
import CardsCompartilhamento from '../components/evolucao/CardsCompartilhamento';
import MetasEditor from '../components/evolucao/MetasEditor';
import RelatorioPdf from '../components/evolucao/RelatorioPdf';

import '../styles/dashboard.css';
import '../styles/evolucao.css';

export default function Evolucao() {
  const { loading, erro, cards, historico, exercicios, grupos, recordes } = useEvolucao();
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

          <DashboardCards cards={cards} />

          <MetasEditor metas={metas} onSalvar={salvar} />

          <RelatorioPdf
            usuario={usuario}
            historico={historico}
            cards={cards}
            metas={metas}
          />

          <CardsCompartilhamento
            historico={historico}
            cards={cards}
            nome={getUsuario().nome}
          />

          <div className="graficos-grid">
            <EvolucaoGrafico dados={historico} />
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
