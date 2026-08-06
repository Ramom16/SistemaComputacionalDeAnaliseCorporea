import { useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="tooltip-date">Data: {label}</p>
                <p className="tooltip-data">
                    <span className="tooltip-dot" style={{ backgroundColor: payload[0].color }}></span>
                    <span className="tooltip-name">{payload[0].name.toUpperCase()}: </span>
                    <strong className="tooltip-val">{payload[0].value}</strong>
                </p>
            </div>
        );
    }
    return null;
};

export default function EvolucaoGrafico({ dados }) {
    const [tipo, setTipo] = useState("peso");

    const configuracao = {
        peso: { nome: "Peso (kg)", cor: "#FFE600" },
        imc: { nome: "IMC", cor: "#4ade80" },
        tmb: { nome: "TMB (kcal)", cor: "#3b82f6" },
        ndc: { nome: "NDC (kcal)", cor: "#a855f7" }
    };

    return (
        <div className="grafico-card">
            <div className="grafico-header">
                <div>
                    <h3 className="grafico-titulo">Evolução Corporal</h3>
                    <p className="grafico-subtitulo">Acompanhe seu progresso ao longo do tempo</p>
                </div>
                <select
                    className="select-custom"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                >
                    <option value="peso">Peso (kg)</option>
                    <option value="imc">IMC</option>
                    <option value="tmb">TMB (kcal)</option>
                    <option value="ndc">NDC (kcal)</option>
                </select>
            </div>

            <div className="grafico-body">
                <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={dados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3 3" />
                        <XAxis dataKey="data" stroke="#b0b0b0" fontSize={12} tickLine={false} />
                        <YAxis stroke="#b0b0b0" fontSize={12} tickLine={false} domain={['auto', 'auto']} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            name={configuracao[tipo].nome}
                            dataKey={tipo}
                            stroke={configuracao[tipo].cor}
                            strokeWidth={3}
                            dot={{ r: 5, fill: configuracao[tipo].cor, stroke: '#070707', strokeWidth: 2 }}
                            activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}