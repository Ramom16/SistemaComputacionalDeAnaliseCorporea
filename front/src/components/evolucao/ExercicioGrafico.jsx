import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip

} from "recharts";
export default function ExerciciosGrafico({
    dados

}) {
    return (
        <div className="grafico-card">
            <h2>
                Exercícios Mais Praticados
            </h2>
            <ResponsiveContainer
                width="100%"
                height={350}
            >
                <BarChart
                    data={dados}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                        dataKey="vezes"
                        fill="#F4C542"
                        radius={[6, 6, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>

    );
}