import {
    FaFire,
    FaClock,
    FaDumbbell,
    FaChartLine
} from "react-icons/fa";
import StatCard from "./StatCard";

export default function DashboardCards({ cards }) {
    return (
        <section className="cards-grid">
            <StatCard
                titulo="Treinos Realizados"
                valor={cards?.totalTreinos || 0}
                icone={<FaDumbbell />}
                tendencia="+15% este mês"
            />
            <StatCard
                titulo="Séries Concluídas"
                valor={cards?.totalExercicios || 0}
                icone={<FaChartLine />}
                tendencia="Frequência alta"
            />
            <StatCard
                titulo="Tempo Treinado"
                valor={`${cards?.tempoTreinado || 0} h`}
                icone={<FaClock />}
                tendencia="Meta semanal OK"
            />
            <StatCard
                titulo="Gasto Calórico"
                valor={`${(cards?.calorias || 0).toLocaleString('pt-BR')} kcal`}
                icone={<FaFire />}
                tendencia="Estimativa acumulada"
            />
        </section>
    );
}