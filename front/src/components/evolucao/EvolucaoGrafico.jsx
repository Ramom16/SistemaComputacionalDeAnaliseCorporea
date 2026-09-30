import { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts';
import CustomTooltip from './CustomTooltip';

const SERIES = {
  peso: { rotulo: 'Peso (kg)', cor: '#FFE600' },
  imc: { rotulo: 'IMC', cor: '#4ade80' },
  tmb: { rotulo: 'TMB (kcal)', cor: '#3b82f6' },
  ndc: { rotulo: 'NDC (kcal)', cor: '#a855f7' },
};

export default function EvolucaoGrafico({ dados }) {
  const [tipo, setTipo] = useState('peso');
  const serie = SERIES[tipo];

  return (
    <div className="grafico-card">
      <div className="grafico-header">
        <div>
          <h3 className="grafico-titulo">Evolução Corporal</h3>
          <p className="grafico-subtitulo">Acompanhe seu progresso ao longo do tempo</p>
        </div>
        <select className="select-custom" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          {Object.entries(SERIES).map(([chave, { rotulo }]) => (
            <option key={chave} value={chave}>{rotulo}</option>
          ))}
        </select>
      </div>

      <div className="grafico-body">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={dados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3 3" />
            <XAxis dataKey="data" stroke="#b0b0b0" fontSize={12} tickLine={false} />
            <YAxis stroke="#b0b0b0" fontSize={12} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip rotulo={serie.rotulo} />} />
            <Line
              type="monotone"
              name={serie.rotulo}
              dataKey={tipo}
              stroke={serie.cor}
              strokeWidth={3}
              dot={{ r: 5, fill: serie.cor, stroke: '#070707', strokeWidth: 2 }}
              activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
