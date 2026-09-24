import { useMemo, useState } from "react";
import { FaDownload, FaShareAlt, FaFire, FaScaleBalanced, FaCalendarCheck } from "react-icons/fa";

const META_SEMANAL_PADRAO = 3;

function criarImagemCard(card, nome) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  const gradiente = ctx.createLinearGradient(0, 0, 1080, 1080);
  gradiente.addColorStop(0, "#171717");
  gradiente.addColorStop(1, "#050505");
  ctx.fillStyle = gradiente;
  ctx.fillRect(0, 0, 1080, 1080);
  ctx.fillStyle = "#ffe600";
  ctx.fillRect(72, 72, 16, 190);
  ctx.font = "700 54px Arial, sans-serif";
  ctx.fillText("IRONFIT", 120, 125);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "400 32px Arial, sans-serif";
  ctx.fillText("MINHA EVOLUÇÃO", 120, 180);
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 68px Arial, sans-serif";
  ctx.fillText(card.titulo.toUpperCase(), 72, 420);
  ctx.fillStyle = "#ffe600";
  ctx.font = "700 178px Arial, sans-serif";
  ctx.fillText(card.valor, 72, 610);
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 54px Arial, sans-serif";
  ctx.fillText(card.subtitulo, 72, 700);
  ctx.fillStyle = "#b0b0b0";
  ctx.font = "400 38px Arial, sans-serif";
  ctx.fillText(card.descricao, 72, 790);
  ctx.fillStyle = "#ffe600";
  ctx.font = "600 34px Arial, sans-serif";
  ctx.fillText(nome ? `RESULTADO DE ${nome.toUpperCase()}` : "RESULTADO PESSOAL", 72, 970);
  return canvas;
}

function baixarImagem(card, nome) {
  const link = document.createElement("a");
  link.download = `ironfit-${card.slug}.png`;
  link.href = criarImagemCard(card, nome).toDataURL("image/png");
  link.click();
}

export default function CardsCompartilhamento({ historico, cards, nome }) {
  const [aviso, setAviso] = useState("");
  const conquistas = useMemo(() => {
    const pesos = historico.map((item) => Number(item.peso)).filter(Number.isFinite);
    const variacaoPeso = pesos.length > 1 ? pesos[pesos.length - 1] - pesos[0] : 0;
    const perdaPeso = Math.max(0, -variacaoPeso);
    const metaSemanal = cards?.metaSemanal || META_SEMANAL_PADRAO;
    const treinosSemana = cards?.treinosSemana || 0;
    return [
      { slug: "evolucao-peso", titulo: perdaPeso > 0 ? "Peso reduzido" : "Evolução de peso", valor: perdaPeso > 0 ? `-${perdaPeso.toFixed(1)} kg` : `${Math.abs(variacaoPeso).toFixed(1)} kg`, subtitulo: perdaPeso > 0 ? "a menos na balança" : "de progresso acompanhado", descricao: pesos.length > 1 ? "Cada registro aproxima você da sua meta." : "Registre suas medidas para acompanhar sua evolução.", icone: <FaScaleBalanced /> },
      { slug: "constancia-semanal", titulo: "Constância semanal", valor: `${treinosSemana}/${metaSemanal}`, subtitulo: "treinos nesta semana", descricao: treinosSemana >= metaSemanal ? "Meta semanal atingida. Continue assim!" : "A consistência constrói grandes resultados.", icone: <FaCalendarCheck /> },
      { slug: "tempo-treinado", titulo: "Tempo de treino", valor: `${cards?.tempoTreinado || 0} h`, subtitulo: "dedicadas ao meu objetivo", descricao: "Disciplina registrada, evolução conquistada.", icone: <FaFire /> },
    ];
  }, [historico, cards]);

  const compartilhar = async (card) => {
    const canvas = criarImagemCard(card, nome);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) {
      setAviso("Nao foi possivel gerar a imagem do card.");
      return;
    }
    const arquivo = new File([blob], `ironfit-${card.slug}.png`, { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [arquivo] })) {
      try {
        await navigator.share({ title: "Minha evolução IronFit", text: `${card.titulo}: ${card.valor}`, files: [arquivo] });
      } catch (erro) {
        if (erro.name !== "AbortError") setAviso("Nao foi possivel abrir o compartilhamento.");
      }
      return;
    }
    baixarImagem(card, nome);
    setAviso("Imagem baixada. Você já pode publicá-la na sua rede social.");
  };

  return (
    <section className="compartilhamento-section" aria-labelledby="compartilhamento-titulo">
      <div className="compartilhamento-header"><h2 id="compartilhamento-titulo">Conquistas para compartilhar</h2><p>Transforme seu progresso em um card pronto para as redes sociais.</p></div>
      <div className="compartilhamento-grid">
        {conquistas.map((card) => <article className="card-conquista" key={card.slug}>
          <div className="card-conquista-marca">IRONFIT</div><div className="card-conquista-icone">{card.icone}</div><span>{card.titulo}</span><strong>{card.valor}</strong><p>{card.subtitulo}</p>
          <div className="card-conquista-acoes"><button type="button" onClick={() => baixarImagem(card, nome)}><FaDownload /> Baixar</button><button type="button" className="btn-compartilhar" onClick={() => compartilhar(card)}><FaShareAlt /> Compartilhar</button></div>
        </article>)}
      </div>
      {aviso && <p className="compartilhamento-aviso" role="status">{aviso}</p>}
    </section>
  );
}
