import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine,
} from 'recharts';
import { FaArrowUp, FaArrowDown, FaMinus, FaBullseye, FaChartArea } from 'react-icons/fa';

const SERIES = {
  peso: {
    rotulo: 'Peso Corporal',
    unidade: 'kg',
    cor: '#FFE600',
    gradienteId: 'gradPeso',
    metaChave: 'pesoAlvo',
    casas: 1,
  },
  imc: {
    rotulo: 'Índice de Massa Corporal (IMC)',
    unidade: '',
    cor: '#4ade80',
    gradienteId: 'gradImc',
    metaChave: 'imcAlvo',
    casas: 1,
  },
  tmb: {
    rotulo: 'Taxa Metabólica Basal (TMB)',
    unidade: 'kcal',
    cor: '#3b82f6',
    gradienteId: 'gradTmb',
    metaChave: null,
    casas: 0,
  },
  ndc: {
    rotulo: 'Necessidade Diária de Calorias (NDC)',
    unidade: 'kcal',
    cor: '#a855f7',
    gradienteId: 'gradNdc',
    metaChave: null,
    casas: 0,
  },
};

function formatarNumero(valor, casas = 1) {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) return '—';
  return Number(valor).toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

function TooltipAvancado({ active, payload, label, serie, dadosCompletos }) {
  if (!active || !payload?.length) return null;

  const itemAtual = payload[0];
  const valorAtual = Number(itemAtual.value);
  const indiceAtual = dadosCompletos.findIndex((d) => d.data === label);
  const itemAnterior = indiceAtual > 0 ? dadosCompletos[indiceAtual - 1] : null;

  let variacaoTexto = null;
  let variacaoTipo = 'neutro';

  if (itemAnterior) {
    const valorAnterior = Number(itemAnterior[itemAtual.dataKey]);
    const diff = valorAtual - valorAnterior;
    if (Math.abs(diff) >= 0.05) {
      const sinal = diff > 0 ? '+' : '';
      variacaoTexto = `${sinal}${formatarNumero(diff, serie.casas)} ${serie.unidade}`;
      variacaoTipo = diff > 0 ? 'subiu' : 'desceu';
    } else {
      variacaoTexto = 'Estável';
    }
  }

  return (
    <div className="custom-tooltip">
      <p className="tooltip-date">Data: <strong>{label}</strong></p>
      <div className="tooltip-data">
        <span className="tooltip-dot" style={{ backgroundColor: serie.cor }} />
        <span className="tooltip-name">{serie.rotulo}:</span>
        <strong className="tooltip-val" style={{ color: serie.cor }}>
          {formatarNumero(valorAtual, serie.casas)} {serie.unidade}
        </strong>
      </div>
      {variacaoTexto && (
        <p className="tooltip-sub" style={{ margin: '6px 0 0', fontSize: '0.8rem', color: '#b0b0b0' }}>
          Comparado ao registro anterior: <span style={{
            color: variacaoTipo === 'desceu' ? '#4ade80' : variacaoTipo === 'subiu' ? '#ffdb4d' : '#888',
            fontWeight: 600,
          }}>{variacaoTexto}</span>
        </p>
      )}
    </div>
  );
}

export default function EvolucaoGrafico({ dados = [], metas = {} }) {
  const [tipo, setTipo] = useState('peso');
  const [periodo, setPeriodo] = useState('todos');

  const serie = SERIES[tipo];

  // Filtra pelo período selecionado
  const dadosFiltrados = useMemo(() => {
    if (!dados || dados.length === 0) return [];
    if (periodo === 'todos') return dados;

    const limite = periodo === '7' ? 7 : 30;
    return dados.slice(-limite);
  }, [dados, periodo]);

  // Estatísticas rápidas (KPIs)
  const kpis = useMemo(() => {
    if (!dadosFiltrados || dadosFiltrados.length === 0) {
      return { atual: 0, min: 0, max: 0, delta: 0, deltaPercent: 0 };
    }

    const valores = dadosFiltrados.map((d) => Number(d[tipo])).filter((v) => !Number.isNaN(v) && v > 0);
    if (valores.length === 0) {
      return { atual: 0, min: 0, max: 0, delta: 0, deltaPercent: 0 };
    }

    const primeiro = valores[0];
    const atual = valores[valores.length - 1];
    const min = Math.min(...valores);
    const max = Math.max(...valores);
    const delta = atual - primeiro;
    const deltaPercent = primeiro > 0 ? (delta / primeiro) * 100 : 0;

    return { atual, min, max, delta, deltaPercent };
  }, [dadosFiltrados, tipo]);

  const valorMeta = serie.metaChave && metas?.[serie.metaChave] ? Number(metas[serie.metaChave]) : null;

  return (
    <div className="grafico-card evolucao-grafico-destaque">
      <div className="grafico-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaChartArea style={{ color: 'var(--primary-yellow)', fontSize: '1.2rem' }} />
            <h3 className="grafico-titulo">Evolução de {serie.rotulo}</h3>
          </div>
          <p className="grafico-subtitulo">
            Acompanhe suas curvas históricas detalhadas com consolidação diária
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Seletor de Período */}
          <div className="periodo-botoes" role="group" aria-label="Filtrar por período">
            <button
              type="button"
              className={`btn-periodo ${periodo === '7' ? 'ativo' : ''}`}
              onClick={() => setPeriodo('7')}
            >
              7 dias
            </button>
            <button
              type="button"
              className={`btn-periodo ${periodo === '30' ? 'ativo' : ''}`}
              onClick={() => setPeriodo('30')}
            >
              30 dias
            </button>
            <button
              type="button"
              className={`btn-periodo ${periodo === 'todos' ? 'ativo' : ''}`}
              onClick={() => setPeriodo('todos')}
            >
              Tudo
            </button>
          </div>

          {/* Seletor de Tipo */}
          <select
            className="select-custom"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            aria-label="Métrica do gráfico"
          >
            {Object.entries(SERIES).map(([chave, { rotulo }]) => (
              <option key={chave} value={chave}>{rotulo}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mini-Cards de Estatísticas Rápidas do Gráfico */}
      {dadosFiltrados.length > 0 && (
        <div className="grafico-kpi-bar">
          <div className="kpi-mini-card">
            <span className="kpi-rotulo">Atual</span>
            <strong className="kpi-valor" style={{ color: serie.cor }}>
              {formatarNumero(kpis.atual, serie.casas)} {serie.unidade}
            </strong>
          </div>
          <div className="kpi-mini-card">
            <span className="kpi-rotulo">Mínimo no período</span>
            <strong className="kpi-valor">
              {formatarNumero(kpis.min, serie.casas)} {serie.unidade}
            </strong>
          </div>
          <div className="kpi-mini-card">
            <span className="kpi-rotulo">Máximo no período</span>
            <strong className="kpi-valor">
              {formatarNumero(kpis.max, serie.casas)} {serie.unidade}
            </strong>
          </div>
          <div className="kpi-mini-card">
            <span className="kpi-rotulo">Variação Total</span>
            <strong className={`kpi-valor ${kpis.delta > 0 ? 'kpi-sobe' : kpis.delta < 0 ? 'kpi-desce' : ''}`}>
              {kpis.delta > 0 ? <FaArrowUp /> : kpis.delta < 0 ? <FaArrowDown /> : <FaMinus />}
              {' '}
              {formatarNumero(Math.abs(kpis.delta), serie.casas)} {serie.unidade}
              {kpis.deltaPercent !== 0 && (
                <span className="kpi-percent">
                  ({kpis.delta > 0 ? '+' : ''}{formatarNumero(kpis.deltaPercent, 1)}%)
                </span>
              )}
            </strong>
          </div>
          {valorMeta && (
            <div className="kpi-mini-card kpi-meta-card">
              <span className="kpi-rotulo"><FaBullseye /> Meta Fixada</span>
              <strong className="kpi-valor" style={{ color: '#ffdb4d' }}>
                {formatarNumero(valorMeta, serie.casas)} {serie.unidade}
              </strong>
            </div>
          )}
        </div>
      )}

      {/* Gráfico Recharts de Alta Definição */}
      <div className="grafico-body">
        {dadosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-gray)' }}>
            Nenhuma medição registrada para o período selecionado.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={dadosFiltrados} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id={serie.gradienteId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={serie.cor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={serie.cor} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3 3" />
              <XAxis dataKey="data" stroke="#b0b0b0" fontSize={11} tickLine={false} dy={5} />
              <YAxis
                stroke="#b0b0b0"
                fontSize={11}
                tickLine={false}
                domain={['auto', 'auto']}
                tickFormatter={(v) => formatarNumero(v, serie.casas === 0 ? 0 : 1)}
              />
              <Tooltip
                content={
                  <TooltipAvancado
                    serie={serie}
                    dadosCompletos={dadosFiltrados}
                  />
                }
              />

              {valorMeta && (
                <ReferenceLine
                  y={valorMeta}
                  stroke="#ffdb4d"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{
                    value: `Meta: ${valorMeta} ${serie.unidade}`,
                    fill: '#ffdb4d',
                    position: 'top',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}
                />
              )}

              <Area
                type="monotone"
                dataKey={tipo}
                stroke={serie.cor}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#${serie.gradienteId})`}
                dot={{ r: 4, fill: serie.cor, stroke: '#070707', strokeWidth: 2 }}
                activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
