import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip';

const CORES = ['#FFE600', '#3b82f6', '#4ade80', '#a855f7', '#f97316', '#ec4899'];

export default function GrupoMuscularGrafico({ dados }) {
  return (
    <div className="grafico-card">
      <div className="grafico-header">
        <div>
          <h3 className="grafico-titulo">Distribuição de Grupos Musculares</h3>
          <p className="grafico-subtitulo">Foco relativo em cada grupo de treino</p>
        </div>
      </div>

      <div className="grafico-body">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={dados}
              dataKey="quantidade"
              nameKey="grupo"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
            >
              {dados.map((item, index) => (
                <Cell
                  key={item.grupo ?? index}
                  fill={CORES[index % CORES.length]}
                  stroke="rgba(0,0,0,0.4)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip rotulo="Séries" sufixo=" séries" />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
