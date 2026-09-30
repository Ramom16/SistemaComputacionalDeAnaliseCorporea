/**
 * Tooltip único para os três gráficos. `rotulo` é o texto exibido antes do valor
 * (ex.: "PESO", "FREQUÊNCIA", "SÉRIES").
 */
export default function CustomTooltip({ ativo, payload, label, rotulo, sufixo = '' }) {
  if (!ativo || !payload?.length) return null;

  const ponto = payload[0];

  return (
    <div className="custom-tooltip">
      <p className="tooltip-date">{label ?? ponto.name}</p>
      <p className="tooltip-data">
        <span className="tooltip-dot" style={{ backgroundColor: ponto.color ?? ponto.payload?.fill }}></span>
        <span className="tooltip-name">{rotulo}: </span>
        <strong className="tooltip-val">{ponto.value}{sufixo}</strong>
      </p>
    </div>
  );
}
