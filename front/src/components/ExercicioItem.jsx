import React from "react";

export default function ExercicioItem({ exercicio, numero }) {
  // Suporta a estrutura de tabela associativa do Prisma (TreinoExercicio -> Exercicio)
  const nome = exercicio.exercicio?.nome || exercicio.nome || "Exercício";
  const descricao = exercicio.exercicio?.descricao || exercicio.descricao || "Sem instruções disponíveis";
  const series = exercicio.series || 3;
  const repeticoes = exercicio.repeticoes || "10–12";
  const descanso = exercicio.descanso_segundos || 60;
  const grupoMuscular = exercicio.grupo_muscular || "Não especificado";
  const tipoExercicio = exercicio.tipo || "Forca";
  const video = exercicio.exercicio?.caminho_video || exercicio.exercicio?.video_url || exercicio.caminho_video || exercicio.video;

  return (
    <div className="exercicio-item">
      <div className="exercicio-info">
        <span className="exercicio-numero">
          {String(numero).padStart(2, "0")}
        </span>
        <div>
          <p className="exercicio-nome">{nome}</p>
          <p className="exercicio-meta">
            {series} séries × {repeticoes} | Descanso: {descanso}s
          </p>
          <p className="exercicio-grupo">
            <strong>Grupo:</strong> {grupoMuscular} | <strong>Tipo:</strong> {tipoExercicio}
          </p>
          <p className="exercicio-descricao">
            <strong>Instruções:</strong> {descricao}
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

      {!video && (
        <div className="exercicio-video-placeholder">
          <p>Vídeo não disponível</p>
        </div>
      )}
    </div>
  );
}