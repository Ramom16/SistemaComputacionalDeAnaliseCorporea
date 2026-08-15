export default function HistoricoTabela({ dados }) {
    if (!dados || dados.length === 0) {
        return (
            <div className="grafico-card">
                <div className="grafico-header">
                    <div>
                        <h3 className="grafico-titulo">Histórico de Registros Corporais</h3>
                        <p className="grafico-subtitulo">Ainda não há medições salvas.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grafico-card">
            <div className="grafico-header">
                <div>
                    <h3 className="grafico-titulo">Histórico de Registros Corporais</h3>
                    <p className="grafico-subtitulo">Todas as suas medições de TMB, IMC e NDC salvas</p>
                </div>
            </div>

            <div className="tabela-container">
                <table className="tabela">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Peso (kg)</th>
                            <th>IMC</th>
                            <th>TMB (kcal)</th>
                            <th>NDC (kcal)</th>
                            <th>Classificação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dados.map((row) => (
                            <tr key={row.id}>
                                <td className="td-bold">{row.data}</td>
                                <td>{row.peso} kg</td>
                                <td>
                                    <span className="imc-badge">{row.imc}</span>
                                </td>
                                <td>{row.tmb} kcal</td>
                                <td>{row.ndc} kcal</td>
                                <td>
                                    <span className="status-tag">{row.classificacao}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}