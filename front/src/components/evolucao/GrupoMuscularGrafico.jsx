import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

const CORES = [
    "#FFE600", // Amarelo primário
    "#3b82f6", // Azul
    "#4ade80", // Verde
    "#a855f7", // Roxo
    "#f97316", // Laranja
    "#ec4899"  // Rosa
];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="tooltip-date">{payload[0].name}</p>
                <p className="tooltip-data">
                    <span className="tooltip-dot" style={{ backgroundColor: payload[0].payload.fill }}></span>
                    <span className="tooltip-name">Séries: </span>
                    <strong className="tooltip-val">{payload[0].value} séries</strong>
                </p>
            </div>
        );
    }
    return null;
};

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
                                    key={`cell-${index}`}
                                    fill={CORES[index % CORES.length]}
                                    stroke="rgba(0,0,0,0.4)"
                                    strokeWidth={2}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
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