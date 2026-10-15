import { useMemo } from 'react';
import { FaCheckCircle, FaFire } from 'react-icons/fa';

const JANELA_DIAS = 28;

// A API devolve a data já formatada em pt-BR ("dd/mm/aaaa").
const paraData = (texto) => {
  const [dia, mes, ano] = String(texto).split('/');
  const data = new Date(`${ano}-${mes}-${dia}`);
  return Number.isNaN(data.getTime()) ? null : data;
};

export default function CalendarioTreinos({ dados = [], recordes = {} }) {
  const dias = useMemo(() => {
    const comTreino = new Set(
      dados
        .map((item) => paraData(item.data))
        .filter(Boolean)
        .map((data) => data.toISOString().slice(0, 10)),
    );

    return Array.from({ length: JANELA_DIAS }, (_, i) => {
      const data = new Date();
      data.setHours(12, 0, 0, 0);
      data.setDate(data.getDate() - (JANELA_DIAS - 1 - i));
      return { dia: data.getDate(), treinou: comTreino.has(data.toISOString().slice(0, 10)) };
    });
  }, [dados]);

  return (
    <div className="grafico-card">
      <div className="grafico-header">
        <div>
          <h3 className="grafico-titulo">Constância &amp; Frequência</h3>
          <p className="grafico-subtitulo">Mapa de atividades dos últimos 28 dias</p>
        </div>
        <div className="streak-badge">
          <FaFire /> {recordes.diasSeguidos ?? '—'}
        </div>
      </div>

      <div className="calendario-container">
        <div className="calendario-grid">
          {dias.map((item) => (
            <div
              key={item.dia}
              className={`dia-box ${item.treinou ? 'ativo' : ''}`}
              title={`Dia ${item.dia}: ${item.treinou ? 'Registro encontrado' : 'Sem registro'}`}
            >
              <span className="dia-numero">{item.dia}</span>
              {item.treinou && <FaCheckCircle className="dia-check-icon" />}
            </div>
          ))}
        </div>

        <div className="calendario-legenda">
          <div className="legenda-item">
            <span className="legenda-cor ativo"></span>
            <span>Registro encontrado</span>
          </div>
          <div className="legenda-item">
            <span className="legenda-cor inativo"></span>
            <span>Dia sem registro</span>
          </div>
        </div>
      </div>
    </div>
  );
}
