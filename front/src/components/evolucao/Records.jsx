import { FaTrophy, FaFire, FaDumbbell, FaChartLine, FaMedal, FaCalendarCheck } from "react-icons/fa";

export default function Recordes({ dados }) {
    const listaRecordes = [
        { titulo: "Carga Supino Máx.", valor: dados?.supinoMax || "95 kg", icone: <FaDumbbell />, detalhe: "Recorde pessoal" },
        { titulo: "Carga Agachamento", valor: dados?.agachamentoMax || "120 kg", icone: <FaTrophy />, detalhe: "Recorde pessoal" },
        { titulo: "Sequência de Dias", valor: dados?.diasSeguidos || "12 dias", icone: <FaCalendarCheck />, detalhe: "Chama acesa!" },
        { titulo: "Maior Evolução", valor: dados?.maiorPerdaPeso || "7.5 kg", icone: <FaChartLine />, detalhe: "Gordura eliminada" },
        { titulo: "Tempo de Treino", valor: dados?.totalHoras || "48 hrs", icone: <FaMedal />, detalhe: "Total acumulado" },
        { titulo: "Calorias Queimadas", valor: dados?.caloriasQueimadas || "18.400 kcal", icone: <FaFire />, detalhe: "Estimativa total" },
    ];

    return (
        <div className="grafico-card">
            <div className="grafico-header">
                <div>
                    <h3 className="grafico-titulo">Recordes Pessoais & Conquistas</h3>
                    <p className="grafico-subtitulo">Seus melhores resultados e marcas alcançadas</p>
                </div>
            </div>

            <div className="recordes-grid">
                {listaRecordes.map((item, idx) => (
                    <div key={idx} className="recorde-item-card">
                        <div className="recorde-icon-wrapper">{item.icone}</div>
                        <div className="recorde-info">
                            <span className="recorde-titulo">{item.titulo}</span>
                            <h4 className="recorde-valor">{item.valor}</h4>
                            <span className="recorde-tag">{item.detalhe}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}