import { useEvolucao } from '../hooks/useEvolucao';
import DashboardNavbar from '../components/DashboardNavbar';
import { getUsuario } from '../services/auth';

import Header from '../components/evolucao/Header';
import DashboardCards from '../components/evolucao/DashboardCards';
import EvolucaoGrafico from '../components/evolucao/EvolucaoGrafico';
import ExerciciosGrafico from '../components/evolucao/ExercicioGrafico';
import GrupoMuscularGrafico from '../components/evolucao/GrupoMuscularGrafico';
import Recordes from '../components/evolucao/Records';
import CalendarioTreinos from '../components/evolucao/CalendarioTreinos';
import HistoricoTabela from '../components/evolucao/HistoricoTabela';
import CardsCompartilhamento from '../components/evolucao/CardsCompartilhamento';

import '../styles/dashboard.css';
import '../styles/evolucao.css';

export default function Evolucao() {
  const { loading, erro, cards, historico, exercicios, grupos, recordes } = useEvolucao();

  if (loading) return <div className="loading">Carregando evolução...</div>;
  if (erro) return <div className="loading" role="alert">{erro}</div>;

  return (
    <>
      <DashboardNavbar />
      <div className="dashboard-layout">
        <main className="dashboard-content">
          <Header />

          <DashboardCards cards={cards} />

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
