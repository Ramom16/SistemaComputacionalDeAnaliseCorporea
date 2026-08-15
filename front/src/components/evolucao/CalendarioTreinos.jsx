import { FaCheckCircle, FaFire } from "react-icons/fa";

export default function CalendarioTreinos() {
    const diasMes = Array.from({ length: 28 }, (_, i) => {
        const dia = i + 1;
        const treinou = [1, 2, 4, 5, 7, 8, 10, 11, 14, 15, 17, 18, 20, 21, 23, 24, 26, 27].includes(dia);
        return { dia, treinou };
    });

    return (
        <div className="grafico-card">
            <div className="grafico-header">
                <div>
                    <h3 className="grafico-titulo">Constância & Frequência</h3>
                    <p className="grafico-subtitulo">Mapa de atividades dos últimos 28 dias</p>
                </div>
                <div className="streak-badge">
                    <FaFire /> 12 Dias Seguidos
                </div>
            </div>

            <div className="calendario-container">
                <div className="calendario-grid">
                    {diasMes.map((item) => (
                        <div
                            key={item.dia}
                            className={`dia-box ${item.treinou ? "ativo" : ""}`}
                            title={`Dia ${item.dia}: ${item.treinou ? "Treino Concluído" : "Descanso"}`}
                        >
                            <span className="dia-numero">{item.dia}</span>
                            {item.treinou && <FaCheckCircle className="dia-check-icon" />}
                        </div>
                    ))}
                </div>
                <div className="calendario-legenda">
                    <div className="legenda-item">
                        <span className="legenda-cor ativo"></span>
                        <span>Treino Realizado</span>
                    </div>
                    <div className="legenda-item">
                        <span className="legenda-cor inativo"></span>
                        <span>Dia de Descanso</span>
                    </div>
                </div>
            </div>
        </div>
    );
}