import { useState } from "react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from "recharts";

export default function EvolucaoGrafico({ dados }) {
    const [tipo, setTipo] = useState("peso");
    const cores = {
        peso: "#F4C542",
        imc: "#4CAF50",
        tmb: "#2196F3",
        ndc: "#E91E63"
    };
    return (
        <div className="grafico-card">
            <div className="grafico-header">
                <h2>Evolução Corporal</h2>
                <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                >
                    <option value="peso">Peso</option>
                    <option value="imc">IMC</option>
                    <option value="tmb">TMB</option>
                    <option value="ndc">NDC</option>
                </select>
            </div>
            <ResponsiveContainer
                width="100%"
                height={350}
            >
                <LineChart
                    data={dados}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey={tipo}
                        stroke={cores[tipo]}
                        strokeWidth={3}
                        dot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

}