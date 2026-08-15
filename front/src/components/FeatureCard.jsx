import React from 'react';

export default function FeatureCard({ title, paragraphs, onClick }) {
  return (
    <div className="delivery-item">
      <div className="delivery-card" onClick={onClick}>
        <div className="card-bg"></div>
        <div className="card-overlay"></div>
        <div className="card-content">
          <h3 className="card-title title-slanted" dangerouslySetInnerHTML={{ __html: title }}></h3>
        </div>
      </div>
      <div className="delivery-description">
        {paragraphs.map((p, index) => (
          <p key={index}>{p}</p>
        ))}
      </div>
    </div>
  );
}
