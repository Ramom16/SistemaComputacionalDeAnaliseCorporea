import {
  FaWeight, FaHeartbeat, FaBurn, FaTint, FaAppleAlt, FaBullseye, FaInfoCircle
} from 'react-icons/fa';

function formatar(valor, casas = 1) {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) return '—';
  return Number(valor).toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

export default function ResumoBiometrico({ detalhes = {} }) {
  if (!detalhes || !detalhes.pesoAtual) return null;

  const {
    pesoAtual,
    pesoInicial,
    pesoMinimo,
    pesoMaximo,
    variacaoPesoKg,
    variacaoPercentual,
    alturaCm,
    idade,
    genero,
    nivelAtividade,
    imcAtual,
    classificacaoImc,
    faixaPesoIdeal = {},
    tmbAtual,
    ndcAtual,
    metaEmagrecimento,
    metaHipertrofia,
    aguaDiariaLitros,
    macros = {},
  } = detalhes;

  return (
    <section className="resumo-biometrico-section" aria-labelledby="resumo-bio-titulo">
      <div className="resumo-bio-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaHeartbeat style={{ color: 'var(--primary-yellow)', fontSize: '1.4rem' }} />
          <div>
            <h2 id="resumo-bio-titulo" className="resumo-bio-title">
              Painel Biométrico e Metabólico
            </h2>
            <p className="resumo-bio-sub">
              Análise completa e individualizada das suas métricas corporais e necessidades calóricas diárias
            </p>
          </div>
        </div>
      </div>

      <div className="resumo-bio-grid">
        {/* Card 1: Perfil e Peso */}
        <div className="bio-card">
          <div className="bio-card-topo">
            <span className="bio-card-tag"><FaWeight /> Balanço de Peso</span>
            <span className="bio-dado-destaque">{formatar(pesoAtual, 1)} kg</span>
          </div>
          <p className="bio-card-subtitulo">
            {genero} • {idade} anos • {alturaCm} cm • Nível {nivelAtividade}
          </p>
          <div className="bio-detalhes-lista">
            <div className="bio-item">
              <span>Peso inicial:</span>
              <strong>{formatar(pesoInicial, 1)} kg</strong>
            </div>
            <div className="bio-item">
              <span>Menor peso atingido:</span>
              <strong>{formatar(pesoMinimo, 1)} kg</strong>
            </div>
            <div className="bio-item">
              <span>Maior peso registrado:</span>
              <strong>{formatar(pesoMaximo, 1)} kg</strong>
            </div>
            <div className="bio-item">
              <span>Variação total:</span>
              <strong style={{ color: variacaoPesoKg <= 0 ? '#4ade80' : '#ffdb4d' }}>
                {variacaoPesoKg > 0 ? `+${formatar(variacaoPesoKg, 1)}` : formatar(variacaoPesoKg, 1)} kg ({variacaoPercentual > 0 ? `+${variacaoPercentual}` : variacaoPercentual}%)
              </strong>
            </div>
          </div>
        </div>

        {/* Card 2: IMC e Faixa Saudável */}
        <div className="bio-card">
          <div className="bio-card-topo">
            <span className="bio-card-tag"><FaBullseye /> IMC & Saúde</span>
            <span className="bio-dado-destaque" style={{ color: '#4ade80' }}>
              {formatar(imcAtual, 1)}
            </span>
          </div>
          <p className="bio-card-subtitulo">
            Classificação OMS: <strong>{classificacaoImc}</strong>
          </p>
          <div className="bio-detalhes-lista">
            <div className="bio-item">
              <span>Faixa ideal para sua altura:</span>
              <strong>
                {faixaPesoIdeal.min ? `${faixaPesoIdeal.min} a ${faixaPesoIdeal.max} kg` : '—'}
              </strong>
            </div>
            <div className="bio-item">
              <span>Referência de IMC Saudável:</span>
              <strong>18,5 a 24,9 kg/m²</strong>
            </div>
            <div className="bio-item">
              <span>Consolidação de dados:</span>
              <strong style={{ color: '#4ade80' }}>1 cálculo diário ativo</strong>
            </div>
          </div>
        </div>

        {/* Card 3: Metabolismo Energético (TMB e NDC) */}
        <div className="bio-card">
          <div className="bio-card-topo">
            <span className="bio-card-tag"><FaBurn /> Gasto Calórico</span>
            <span className="bio-dado-destaque" style={{ color: '#3b82f6' }}>
              {formatar(ndcAtual, 0)} kcal
            </span>
          </div>
          <p className="bio-card-subtitulo">Necessidade Diária de Calorias (NDC) para manter o peso</p>
          <div className="bio-detalhes-lista">
            <div className="bio-item">
              <span>Taxa Metabólica Basal (TMB):</span>
              <strong>{formatar(tmbAtual, 0)} kcal/dia</strong>
            </div>
            <div className="bio-item">
              <span>🔥 Meta para Emagrecimento:</span>
              <strong style={{ color: '#4ade80' }}>
                {metaEmagrecimento ? `${formatar(metaEmagrecimento, 0)} kcal/dia` : '—'}
              </strong>
            </div>
            <div className="bio-item">
              <span>💪 Meta para Hipertrofia:</span>
              <strong style={{ color: '#ffdb4d' }}>
                {metaHipertrofia ? `${formatar(metaHipertrofia, 0)} kcal/dia` : '—'}
              </strong>
            </div>
          </div>
        </div>

        {/* Card 4: Hidratação e Nutrientes */}
        <div className="bio-card">
          <div className="bio-card-topo">
            <span className="bio-card-tag"><FaTint /> Hidratação & Macros</span>
            <span className="bio-dado-destaque" style={{ color: '#38bdf8' }}>
              {formatar(aguaDiariaLitros, 1)} L/dia
            </span>
          </div>
          <p className="bio-card-subtitulo">Ingestão de água diária calculada (35ml/kg)</p>
          <div className="bio-detalhes-lista">
            <div className="bio-item">
              <span>🥩 Proteínas sugeridas (30%):</span>
              <strong>{macros.proteinaG || 0} g/dia</strong>
            </div>
            <div className="bio-item">
              <span>🍞 Carboidratos sugeridos (40%):</span>
              <strong>{macros.carboG || 0} g/dia</strong>
            </div>
            <div className="bio-item">
              <span>🥑 Gorduras saudáveis (30%):</span>
              <strong>{macros.gorduraG || 0} g/dia</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
