import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

const cores = [
    "#F4C542",
    "#2196F3",
    "#4CAF50",
    "#E91E63",
    "#9C27B0",
    "#FF9800"

];
export default function GrupoMuscularGrafico({ dados }) {
    return (
        <div className="grafico-card">
            <h2>
                Distribuição dos Grupos Musculares
            </h2>
            <ResponsiveContainer
                width="100%"
                height={350}
            >
                <PieChart>
                    <Pie
                        data={dados}
                        dataKey="quantidade"
                        nameKey="grupo"
                        outerRadius={120}
                        label
                    >
                        {
                            dados.map((item, index) => (
                                <Cell
                                    key={index}
                                    fill={cores[index % cores.length]}
                                />

                            ))
                        }
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}