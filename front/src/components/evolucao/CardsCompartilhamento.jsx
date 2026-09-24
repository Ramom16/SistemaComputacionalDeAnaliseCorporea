import { useMemo, useState } from "react";
import { FaDownload, FaShareAlt, FaFire, FaScaleBalanced, FaCalendarCheck } from "react-icons/fa";

const META_SEMANAL_PADRAO = 3;

/**
 * Desenha o card em formato 1080x1350 (4:5 - Ideal para Instagram/Stories/Feed)
 */
function criarImagemCard(card, nome) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");

  // 1. Fundo Gradiente Escuro (Tema IronFit)
  const gradiente = ctx.createLinearGradient(0, 0, 1080, 1350);
  gradiente.addColorStop(0, "#171717");
  gradiente.addColorStop(1, "#080808");
  ctx.fillStyle = gradiente;
  ctx.fillRect(0, 0, 1080, 1350);

  // 2. Borda superior amarela (#ffe600)
  ctx.fillStyle = "#ffe600";
  ctx.fillRect(0, 0, 1080, 16);

  // 3. Detalhes de Marca
  ctx.fillStyle = "#ffe600";
  ctx.fillRect(80, 100, 12, 120);

  ctx.fillStyle = "#ffe600";
  ctx.font = "bold 48px Arial, sans-serif";
  ctx.fillText("IRONFIT", 112, 150);

  ctx.fillStyle = "#9ca3af";
  ctx.font = "500 28px Arial, sans-serif";
  ctx.fillText("CONQUISTA REGISTRADA", 112, 195);

  // 4. Título do Card
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 64px Arial, sans-serif";
  ctx.fillText(card.titulo.toUpperCase(), 80, 420);

  // 5. Valor Principal (Destaque Gigante Amarelo)
  ctx.fillStyle = "#ffe600";
  ctx.font = "bold 160px Arial, sans-serif";
  ctx.fillText(card.valor, 75, 610);

  // 6. Subtítulo e Descrição
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 48px Arial, sans-serif";
  ctx.fillText(card.subtitulo, 80, 710);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "400 36px Arial, sans-serif";
  ctx.fillText(card.descricao, 80, 800);

  // 7. Rodapé com Nome do Usuário
  const primeiroNome = nome ? nome.trim().split(" ")[0].toUpperCase() : "ATLETA";
  ctx.fillStyle = "#27272a";
  ctx.fillRect(80, 1150, 920, 2); // Linha divisória

  ctx.fillStyle = "#ffe600";
  ctx.font = "600 32px Arial, sans-serif";
  ctx.fillText(`EVOLUÇÃO DE ${primeiroNome}`, 80, 1220);

  ctx.fillStyle = "#71717a";
  ctx.font = "400 28px Arial, sans-serif";
  ctx.fillText("Análise Corporal e Metabólica", 80, 1260);

  return canvas;
}

function baixarImagem(card, nome) {
  const canvas = criarImagemCard(card, nome);
  const link = document.createElement("a");
  link.download = `ironfit-${card.slug}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export default function CardsCompartilhamento({ historico = [], cards = {}, nome = "" }) {
  const [aviso, setAviso] = useState("");

  const conquistas = useMemo(() => {
    // CORREÇÃO DO BUG: Suporta `peso_kg`, `peso` ou `valor`
    const pesos = historico
      .map((item) => Number(item.peso_kg ?? item.peso ?? item.valor))
      .filter(Number.isFinite);

    const variacaoPeso = pesos.length > 1 ? pesos[pesos.length - 1] - pesos[0] : 0;
    const perdaPeso = Math.max(0, -variacaoPeso);

    const metaSemanal = cards?.metaSemanal || META_SEMANAL_PADRAO;
    const treinosSemana = cards?.treinosSemana || 0;

    return [
      {
        slug: "evolucao-peso",
        titulo: perdaPeso > 0 ? "Peso Reduzido" : "Evolução de Peso",
        valor: perdaPeso > 0 ? `-${perdaPeso.toFixed(1)} kg` : `${Math.abs(variacaoPeso).toFixed(1)} kg`,
        subtitulo: perdaPeso > 0 ? "a menos na balança" : "de variação acompanhada",
        descricao: pesos.length > 1 ? "Cada registro aproxima você do seu objetivo." : "Registre suas medidas para acompanhar a evolução.",
        icone: <FaScaleBalanced />
      },
      {
        slug: "constancia-semanal",
        titulo: "Constância Semanal",
        valor: `${treinosSemana}/${metaSemanal}`,
        subtitulo: "treinos concluídos esta semana",
        descricao: treinosSemana >= metaSemanal ? "Meta semanal batida! Excelente ritmo." : "A frequência constante gera grandes resultados.",
        icone: <FaCalendarCheck />
      },
      {
        slug: "tempo-treinado",
        titulo: "Tempo Dedicado",
        valor: `${cards?.tempoTreinado || 0} h`,
        subtitulo: "de esforço acumulado no treino",
        descricao: "Disciplina diária transformada em conquistas.",
        icone: <FaFire />
      }
    ];
  }, [historico, cards]);

  const compartilhar = async (card) => {
    try {
      const canvas = criarImagemCard(card, nome);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

      if (!blob) {
        setAviso("Não foi possível gerar a imagem.");
        return;
      }

      const arquivo = new File([blob], `ironfit-${card.slug}.png`, { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [arquivo] })) {
        await navigator.share({
          title: "Minha Evolução no IronFit",
          text: `Confira minha conquista: ${card.titulo} - ${card.valor}!`,
          files: [arquivo]
        });
        return;
      }

      // Fallback para navegação/dispositivos sem Web Share API
      baixarImagem(card, nome);
      setAviso("Card baixado! Você já pode publicar nas suas redes sociais.");
    } catch (erro) {
      if (erro.name !== "AbortError") {
        setAviso("Erro ao compartilhar. O card foi baixado para o seu dispositivo.");
        baixarImagem(card, nome);
      }
    }
  };

  return (
    <section className="compartilhamento-section" aria-labelledby="compartilhamento-titulo">
      <div className="compartilhamento-header">
        <h2 id="compartilhamento-titulo">Conquistas para Compartilhar</h2>
        <p>Gere cards personalizados do seu progresso prontos para o Instagram e redes sociais.</p>
      </div>

      <div className="compartilhamento-grid">
        {conquistas.map((card) => (
          <article className="card-conquista" key={card.slug}>
            <div className="card-conquista-marca">IRONFIT</div>
            <div className="card-conquista-icone">{card.icone}</div>
            <span>{card.titulo}</span>
            <strong>{card.valor}</strong>
            <p>{card.subtitulo}</p>
            <div className="card-conquista-acoes">
              <button type="button" onClick={() => baixarImagem(card, nome)} title="Baixar PNG">
                <FaDownload /> Baixar
              </button>
              <button type="button" className="btn-compartilhar" onClick={() => compartilhar(card)} title="Compartilhar">
                <FaShareAlt /> Compartilhar
              </button>
            </div>
          </article>
        ))}
      </div>

      {aviso && <p className="compartilhamento-aviso" role="status">{aviso}</p>}
    </section>
  );
}