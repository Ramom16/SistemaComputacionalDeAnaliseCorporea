import { useState } from 'react';
import { FaHistory, FaArrowUp, FaArrowDown } from 'react-icons/fa';

function getBadgeClasse(classificacao) {
  const c = String(classificacao || '').toLowerCase();
  if (c.includes('normal')) return 'badge-sucesso';
  if (c.includes('sobrepeso')) return 'badge-alerta';
  if (c.includes('abaixo')) return 'badge-info';
  if (c.includes('obesidade')) return 'badge-perigo';
  return 'badge-padrao';
}

export default function HistoricoTabela({ dados = [] }) {
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 8;

  if (!dados || dados.length === 0) {
    return (
      <div className="grafico-card">
        <div className="grafico-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaHistory style={{ color: 'var(--primary-yellow)' }} />
              <h3 className="grafico-titulo">Histórico de Registros Corporais</h3>
            </div>
            <p className="grafico-subtitulo">Ainda não há medições salvas no seu perfil.</p>
          </div>
        </div>
      </div>
    );
  }

  // Ordena do mais recente para o mais antigo para a tabela
  const dadosOrdenados = [...dados].reverse();
  const totalPaginas = Math.ceil(dadosOrdenados.length / itensPorPagina);
  const inicio = (pagina - 1) * itensPorPagina;
  const dadosPaginados = dadosOrdenados.slice(inicio, inicio + itensPorPagina);

  return (
    <div className="grafico-card">
      <div className="grafico-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaHistory style={{ color: 'var(--primary-yellow)' }} />
            <h3 className="grafico-titulo">Histórico de Registros Corporais</h3>
          </div>
          <p className="grafico-subtitulo">
            Todas as medições diárias consolidadas com evolução e classificação OMS
          </p>
        </div>
        <span className="total-registros-tag">
          {dados.length} {dados.length === 1 ? 'registro' : 'registros'}
        </span>
      </div>

      <div className="tabela-container">
        <table className="tabela">
          <thead>
            <tr>
              <th>Data</th>
              <th>Peso Corporal</th>
              <th>Variação</th>
              <th>IMC</th>
              <th>Classificação OMS</th>
              <th>TMB (Basal)</th>
              <th>NDC (Gasto Diário)</th>
            </tr>
          </thead>
          <tbody>
            {dadosPaginados.map((row, index) => {
              // Calcula delta em relação à medição anterior no histórico original
              const indiceOriginal = dados.findIndex((item) => item.id === row.id);
              const anterior = indiceOriginal > 0 ? dados[indiceOriginal - 1] : null;
              const delta = anterior ? Number((row.peso - anterior.peso).toFixed(1)) : null;

              return (
                <tr key={row.id}>
                  <td className="td-bold">{row.data}</td>
                  <td>
                    <strong>{row.peso.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} kg</strong>
                  </td>
                  <td>
                    {delta === null ? (
                      <span className="delta-neutro">—</span>
                    ) : delta > 0 ? (
                      <span className="delta-sobe"><FaArrowUp /> +{delta} kg</span>
                    ) : delta < 0 ? (
                      <span className="delta-desce"><FaArrowDown /> {delta} kg</span>
                    ) : (
                      <span className="delta-neutro">0.0 kg</span>
                    )}
                  </td>
                  <td>
                    <span className="imc-badge">{row.imc}</span>
                  </td>
                  <td>
                    <span className={`status-tag ${getBadgeClasse(row.classificacao)}`}>
                      {row.classificacao}
                    </span>
                  </td>
                  <td>{row.tmb.toLocaleString('pt-BR')} kcal</td>
                  <td>{row.ndc.toLocaleString('pt-BR')} kcal</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="paginacao-container" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <button
            type="button"
            className="paginacao-btn"
            disabled={pagina === 1}
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
          >
            Anterior
          </button>
          <span style={{ alignSelf: 'center', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
            Página {pagina} de {totalPaginas}
          </span>
          <button
            type="button"
            className="paginacao-btn"
            disabled={pagina === totalPaginas}
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}