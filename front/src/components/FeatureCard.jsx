export default function FeatureCard({ titulo, paragrafos, onClick }) {
  return (
    <div className="delivery-item">
      <div className="delivery-card" onClick={onClick}>
        <div className="card-bg"></div>
        <div className="card-overlay"></div>
        <div className="card-content">
          <h3 className="card-title title-slanted">
            {titulo.map((linha, i) => (
              <span key={linha}>
                {i > 0 && <br />}
                {linha}
              </span>
            ))}
          </h3>
        </div>
      </div>
      <div className="delivery-description">
        {paragrafos.map((paragrafo) => <p key={paragrafo}>{paragrafo}</p>)}
      </div>
    </div>
  );
}
