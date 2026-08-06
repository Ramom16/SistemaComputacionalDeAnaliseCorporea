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
                titulo="Treinos"
                valor={cards.totalTreinos}
                icone={<FaDumbbell />}
            />

            <StatCard
                titulo="Exercícios"
                valor={cards.totalExercicios}
                icone={<FaChartLine />}
            />

            <StatCard
                titulo="Tempo"
                valor={`${cards.tempoTreinado} h`}
                icone={<FaClock />}
            />

            <StatCard
                titulo="Calorias"
                valor={`${cards.calorias} kcal`}
                icone={<FaFire />}
            />

        </section>

    );

}