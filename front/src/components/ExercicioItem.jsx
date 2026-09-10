import React from "react";

function obterUrlIncorporavel(url) {
  if (!url || typeof url !== "string") return null;

  try {
    const videoUrl = new URL(url);
    const host = videoUrl.hostname.replace("www.", "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = videoUrl.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }

    if (host === "youtu.be") {
      const id = videoUrl.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }

    if (host === "vimeo.com") {
      const id = videoUrl.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : url;
    }

    return url;
  } catch {
    return null;
  }
}

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
  const videoIncorporado = obterUrlIncorporavel(video);

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
          <section className="exercicio-instrucoes" aria-label={`Instruções para ${nome}`}>
            <strong>Instruções de execução</strong>
            <p>{descricao}</p>
          </section>
        </div>
      </div>

      {videoIncorporado && (
        <section className="exercicio-video" aria-label={`Vídeo demonstrativo de ${nome}`}>
          <div className="exercicio-video-cabecalho">
            <strong>Vídeo demonstrativo</strong>
            <a href={video} target="_blank" rel="noreferrer">Abrir vídeo</a>
          </div>
          <iframe
            src={videoIncorporado}
            title={nome}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </section>
      )}

      {!videoIncorporado && (
        <div className="exercicio-video-placeholder">
          <p>Vídeo demonstrativo não disponível</p>
        </div>
      )}
    </div>
  );
}
