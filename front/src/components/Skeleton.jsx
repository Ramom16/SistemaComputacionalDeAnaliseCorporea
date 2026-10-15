import '../styles/skeleton.css';

/**
 * Bloco de carregamento (placeholder animado).
 * `variante`: texto | titulo | linha | botao | circulo | retangulo
 */
export function Skeleton({ variante = 'texto', largura, altura, className = '' }) {
  const estilo = {};
  if (largura) estilo.width = largura;
  if (altura) estilo.height = altura;

  return (
    <span
      className={`skeleton skeleton-${variante} ${className}`.trim()}
      style={estilo}
      aria-hidden="true"
    />
  );
}

/** Card de placeholder, com o mesmo aspeto dos cards reais. */
export function SkeletonCard({ linhas = 2 }) {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <Skeleton variante="linha" largura="35%" />
      <Skeleton variante="titulo" largura="70%" />
      {Array.from({ length: linhas }).map((_, indice) => (
        <Skeleton
          key={indice}
          variante="texto"
          largura={indice === linhas - 1 ? '80%' : '100%'}
        />
      ))}
      <Skeleton variante="botao" />
    </div>
  );
}

/**
 * Grelha de cards de placeholder. Recebe a classe da grelha real
 * (ex.: "exercicios-grid") para manter o layout idêntico ao conteúdo final.
 */
export function SkeletonGrid({ itens = 9, linhas = 2, className = '' }) {
  return (
    <div className={className} aria-busy="true" aria-label="Carregando conteúdo">
      {Array.from({ length: itens }).map((_, indice) => (
        <SkeletonCard key={indice} linhas={linhas} />
      ))}
    </div>
  );
}

export default Skeleton;
