import { useCallback, useState } from 'react';

const PREFIXO = 'ironfit-metas';

const PADRAO = {
  pesoAlvo: '',
  imcAlvo: 22.5,
  treinosSemana: 3,
};

const chave = (idUsuario) => `${PREFIXO}:${idUsuario}`;

function normalizar(novas = {}) {
  const converter = (valor) => {
    if (valor === '' || valor === null || valor === undefined) return '';
    const convertido = Number(valor);
    return Number.isFinite(convertido) ? convertido : '';
  };

  return {
    pesoAlvo: converter(novas.pesoAlvo),
    imcAlvo: converter(novas.imcAlvo),
    treinosSemana: converter(novas.treinosSemana),
  };
}

function ler(idUsuario) {
  if (!idUsuario) return { ...PADRAO };
  try {
    const bruto = localStorage.getItem(chave(idUsuario));
    if (!bruto) return { ...PADRAO };
    return { ...PADRAO, ...normalizar(JSON.parse(bruto)) };
  } catch {
    return { ...PADRAO };
  }
}

function persistir(idUsuario, metas) {
  if (!idUsuario) return false;
  try {
    localStorage.setItem(chave(idUsuario), JSON.stringify(metas));
    return true;
  } catch {
    return false;
  }
}

export function useMetas(idUsuario) {
  const [metas, setMetas] = useState(() => ler(idUsuario));

  const salvar = useCallback(
    (novas) => {
      const completo = { ...PADRAO, ...normalizar(novas) };
      setMetas(completo);
      persistir(idUsuario, completo);
      return completo;
    },
    [idUsuario],
  );

  return { metas, salvar };
}

export default useMetas;
