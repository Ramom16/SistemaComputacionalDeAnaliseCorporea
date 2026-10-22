import { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';

export default function RelatorioPdf({ usuario, historico = [], cards = {}, metas = {}, detalhesCorporais = {} }) {
  const [gerando, setGerando] = useState(false);
  const [aviso, setAviso] = useState('');
  const [erro, setErro] = useState('');

  const baixar = async () => {
    setGerando(true);
    setAviso('');
    setErro('');
    try {
      const { gerarRelatorioPdf } = await import('../../services/relatorioPdf');
      const arquivo = gerarRelatorioPdf({ usuario, historico, cards, metas, detalhesCorporais });
      setAviso(`Relatório gerado com sucesso: ${arquivo}`);
    } catch (e) {
      console.error('Erro ao gerar relatório em PDF:', e);
      setErro('Não foi possível gerar o relatório. Tente novamente.');
    } finally {
      setGerando(false);
    }
  };

  return (
    <section className="relatorio-section" aria-labelledby="relatorio-titulo">
      <div className="relatorio-header">
        <h2 id="relatorio-titulo">Relatório em PDF</h2>
        <p>
          Gere um documento completo com histórico de medidas, curvas de IMC/TMB/NDC e
          comparativo de metas para levar ao nutricionista ou personal trainer.
        </p>
      </div>

      <div className="relatorio-acoes">
        <button type="button" className="btn-primario" onClick={baixar} disabled={gerando}>
          <FaFilePdf /> {gerando ? 'Gerando PDF...' : 'Baixar relatório completo (PDF)'}
        </button>
        {aviso && <p className="relatorio-aviso" role="status">{aviso}</p>}
        {erro && <p className="relatorio-aviso relatorio-erro" role="alert">{erro}</p>}
      </div>
    </section>
  );
}
