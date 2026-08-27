import React from "react";

export default function ExercicioItem({ exercicio, numero }) {
  // Suporta a estrutura de tabela associativa do Prisma (TreinoExercicio -> Exercicio)
  const nome = exercicio.exercicio?.nome || exercicio.nome || "Exercício";
  const series = exercicio.series || 3;
  const repeticoes = exercicio.repeticoes || "10–12";
  const video = exercicio.exercicio?.video_url || exercicio.video;

  return (
    <div className="exercicio-item">
      <div className="exercicio-info">
        <span className="exercicio-numero">
          {String(numero).padStart(2, "0")}
        </span>
        <div>
          <p className="exercicio-nome">{nome}</p>
          <p className="exercicio-meta">
            {series} séries × {repeticoes}
          </p>
        </div>
      </div>

      {video && (
        <div className="exercicio-video">
          <iframe
            src={video}
            title={nome}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}