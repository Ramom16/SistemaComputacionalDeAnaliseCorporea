import {
  ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts';
import CustomTooltip from './CustomTooltip';

export default function ExerciciosGrafico({ dados }) {
  return (
    <div className="grafico-card">
      <div className="grafico-header">
        <div>
          <h3 className="grafico-titulo">Exercícios Mais Praticados</h3>
          <p className="grafico-subtitulo">Repetições acumuladas nas sessões</p>
        </div>
      </div>

      <div className="grafico-body">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={dados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3 3" />
            <XAxis
              dataKey="nome"
              stroke="#b0b0b0"
              fontSize={11}
              tickLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={45}
            />
            <YAxis stroke="#b0b0b0" fontSize={12} tickLine={false} />
            <Tooltip content={<CustomTooltip rotulo="Frequência" sufixo=" treinos" />} />
            <Bar dataKey="vezes" fill="#FFE600" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
