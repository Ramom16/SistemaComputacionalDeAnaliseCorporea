import { useState } from 'react';
import { FaBullseye } from 'react-icons/fa';

const somenteNumero = (valor) => {
  if (valor === null || valor === '') return '';
  const convertido = Number(valor);
  return Number.isFinite(convertido) ? convertido : '';
};

export default function MetasEditor({ metas, onSalvar }) {
  const [aviso, setAviso] = useState('');

  const salvar = (evento) => {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    onSalvar({
      pesoAlvo: somenteNumero(dados.get('pesoAlvo')),
      imcAlvo: somenteNumero(dados.get('imcAlvo')),
      treinosSemana: somenteNumero(dados.get('treinosSemana')),
    });
    setAviso('Metas atualizadas! Elas já aparecem no comparativo do relatório em PDF.');
  };

  return (
    <section className="metas-section" aria-labelledby="metas-titulo">
      <div className="metas-header">
        <h2 id="metas-titulo">Metas de Evolução</h2>
        <p>Defina seus objetivos para acompanhar o progresso e gerar o comparativo do relatório.</p>
      </div>

      <form className="metas-form" onSubmit={salvar}>
        <div className="metas-campo">
          <label htmlFor="meta-peso">Peso alvo (kg)</label>
          <input
            id="meta-peso"
            name="pesoAlvo"
            type="number"
            min="0"
            step="0.1"
            placeholder="ex.: 78"
            defaultValue={metas?.pesoAlvo ?? ''}
            onChange={() => setAviso('')}
          />
        </div>

        <div className="metas-campo">
          <label htmlFor="meta-imc">IMC alvo</label>
          <input
            id="meta-imc"
            name="imcAlvo"
            type="number"
            min="0"
            step="0.1"
            placeholder="ex.: 22.5"
            defaultValue={metas?.imcAlvo ?? ''}
            onChange={() => setAviso('')}
          />
        </div>

        <div className="metas-campo">
          <label htmlFor="meta-treinos">Treinos por semana</label>
          <input
            id="meta-treinos"
            name="treinosSemana"
            type="number"
            min="0"
            max="14"
            step="1"
            placeholder="ex.: 3"
            defaultValue={metas?.treinosSemana ?? ''}
            onChange={() => setAviso('')}
          />
        </div>

        <div className="metas-acoes">
          <button type="submit" className="btn-primario">
            <FaBullseye /> Salvar metas
          </button>
          {aviso && <p className="metas-aviso" role="status">{aviso}</p>}
        </div>
      </form>
    </section>
  );
}
