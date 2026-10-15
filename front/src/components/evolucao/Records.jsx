import {
  FaTrophy, FaFire, FaDumbbell, FaChartLine, FaMedal, FaCalendarCheck,
} from 'react-icons/fa';

const SEM_VALOR = '—';

const RECORDES = [
  { chave: 'supinoMax', titulo: 'Carga Supino Máx.', icone: <FaDumbbell />, detalhe: 'Recorde pessoal' },
  { chave: 'agachamentoMax', titulo: 'Carga Agachamento', icone: <FaTrophy />, detalhe: 'Recorde pessoal' },
  { chave: 'diasSeguidos', titulo: 'Sequência de Dias', icone: <FaCalendarCheck />, detalhe: 'Chama acesa!' },
  { chave: 'maiorPerdaPeso', titulo: 'Maior Evolução', icone: <FaChartLine />, detalhe: 'Gordura eliminada' },
  { chave: 'totalHoras', titulo: 'Tempo de Treino', icone: <FaMedal />, detalhe: 'Total acumulado' },
  { chave: 'caloriasQueimadas', titulo: 'Calorias Queimadas', icone: <FaFire />, detalhe: 'Estimativa total' },
];

export default function Recordes({ dados }) {
  return (
    <div className="grafico-card">
      <div className="grafico-header">
        <div>
          <h3 className="grafico-titulo">Recordes Pessoais & Conquistas</h3>
          <p className="grafico-subtitulo">Seus melhores resultados e marcas alcançadas</p>
        </div>
      </div>

      <div className="recordes-grid">
        {RECORDES.map(({ chave, titulo, icone, detalhe }) => (
          <div key={chave} className="recorde-item-card">
            <div className="recorde-icon-wrapper">{icone}</div>
            <div className="recorde-info">
              <span className="recorde-titulo">{titulo}</span>
              <h4 className="recorde-valor">{dados?.[chave] || SEM_VALOR}</h4>
              <span className="recorde-tag">{detalhe}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
