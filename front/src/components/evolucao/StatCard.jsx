export default function StatCard({ titulo, valor, icone, tendencia }) {
    return (
        <div className="stat-card">
            <div className="stat-card-header">
                <div className="stat-icon">{icone}</div>
                {tendencia && <span className="stat-badge">{tendencia}</span>}
            </div>
            <div className="stat-card-body">
                <h2 className="stat-value">{valor}</h2>
                <span className="stat-title">{titulo}</span>
            </div>
        </div>
    );
}