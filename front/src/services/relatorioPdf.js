import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const LARGURA_PAGINA = 210;
const ALTURA_PAGINA = 297;
const MARGEM = 16;

const COR = {
  amarelo: [255, 230, 0],
  amareloEscuro: [176, 140, 0],
  verde: [22, 163, 74],
  azul: [37, 99, 235],
  roxo: [147, 51, 234],
  mostarda: [176, 116, 0],
  vermelho: [190, 30, 30],
  preto: [17, 17, 17],
  cinza: [122, 122, 122],
  cinzaClaro: [226, 226, 226],
  fundo: [246, 246, 246],
  branco: [255, 255, 255],
};

const numero = (valor) => {
  const convertido = Number(valor);
  return Number.isFinite(convertido) && valor !== '' && valor !== null ? convertido : null;
};

const arredondar = (valor, casas = 1) => Math.round(valor * 10 ** casas) / 10 ** casas;

const fmt = (valor, casas = 1) =>
  Number(valor).toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });

function classificarImc(imc) {
  const valor = numero(imc);
  if (valor === null) return '—';
  if (valor < 18.5) return 'Abaixo do peso';
  if (valor < 25) return 'Peso normal';
  if (valor < 30) return 'Sobrepeso';
  if (valor < 35) return 'Obesidade grau I';
  if (valor < 40) return 'Obesidade grau II';
  return 'Obesidade grau III';
}

function media(valores) {
  if (!valores.length) return null;
  return valores.reduce((total, valor) => total + valor, 0) / valores.length;
}

function agora() {
  return new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function slug(texto) {
  return String(texto || 'atleta')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'atleta';
}

function cabecalho(doc) {
  doc.setFillColor(...COR.preto);
  doc.rect(0, 0, LARGURA_PAGINA, 14, 'F');
  doc.setFillColor(...COR.amarelo);
  doc.rect(0, 14, LARGURA_PAGINA, 1.2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COR.amarelo);
  doc.text('IRONFIT', MARGEM, 9.6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COR.branco);
  doc.text(
    'Relatório de evolução física • Análise corporal e metabólica',
    LARGURA_PAGINA - MARGEM,
    9.6,
    { align: 'right' },
  );
}

function rodapes(doc) {
  const total = doc.getNumberOfPages();
  for (let pagina = 1; pagina <= total; pagina += 1) {
    doc.setPage(pagina);
    doc.setDrawColor(...COR.cinzaClaro);
    doc.setLineWidth(0.2);
    doc.line(MARGEM, ALTURA_PAGINA - 14, LARGURA_PAGINA - MARGEM, ALTURA_PAGINA - 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COR.cinza);
    doc.text('Documento destinado a nutricionista / personal trainer', MARGEM, ALTURA_PAGINA - 10);
    doc.text(`Emitido em ${agora()}`, MARGEM, ALTURA_PAGINA - 6.4);
    doc.text(`Página ${pagina} de ${total}`, LARGURA_PAGINA - MARGEM, ALTURA_PAGINA - 10, {
      align: 'right',
    });
    doc.text(
      'IronFit • Sistema Computacional de Análise Corpórea',
      LARGURA_PAGINA - MARGEM,
      ALTURA_PAGINA - 6.4,
      { align: 'right' },
    );
  }
}

function secao(doc, y, titulo) {
  doc.setFillColor(...COR.amarelo);
  doc.rect(MARGEM, y, 3.2, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...COR.preto);
  doc.text(titulo.toUpperCase(), MARGEM + 6.5, y + 4.4);
  return y + 10;
}

function caixa(doc, { x, y, w, h, rotulo, valor, detalhe }) {
  doc.setFillColor(...COR.fundo);
  doc.setDrawColor(...COR.cinzaClaro);
  doc.setLineWidth(0.2);
  doc.roundedRect(x, y, w, h, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(...COR.cinza);
  doc.text(String(rotulo).toUpperCase(), x + 3, y + 5);

  const conteudo = String(valor);
  let tamanho = 13;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(tamanho);
  while (doc.getTextWidth(conteudo) > w - 6 && tamanho > 8) {
    tamanho -= 0.5;
    doc.setFontSize(tamanho);
  }
  doc.setTextColor(...COR.preto);
  doc.text(doc.splitTextToSize(conteudo, w - 6), x + 3, y + 13);

  if (detalhe) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COR.cinza);
    doc.text(doc.splitTextToSize(String(detalhe), w - 6), x + 3, y + 18);
  }
}

function desenharGrafico(doc, { x, y, w, h, titulo, unidade, dados, cor, casas = 1 }) {
  const eixoX = x + 12;
  const eixoY = y + 9;
  const larguraPlot = w - 13;
  const alturaPlot = h - 20;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COR.preto);
  doc.text(titulo, x, y + 4);

  if (!dados || dados.length === 0) {
    doc.setDrawColor(...COR.cinzaClaro);
    doc.setLineWidth(0.2);
    doc.roundedRect(eixoX, eixoY, larguraPlot, alturaPlot, 1, 1, 'S');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COR.cinza);
    doc.text('Sem medições registradas', eixoX + larguraPlot / 2, eixoY + alturaPlot / 2, {
      align: 'center',
    });
    return;
  }

  const valores = dados.map((item) => item.valor);
  let minimo = Math.min(...valores);
  let maximo = Math.max(...valores);
  if (minimo === maximo) {
    minimo -= 1;
    maximo += 1;
  } else {
    const folga = (maximo - minimo) * 0.15;
    minimo -= folga;
    maximo += folga;
  }

  const linhasGrade = 4;
  const passoY = alturaPlot / linhasGrade;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  for (let i = 0; i <= linhasGrade; i += 1) {
    const linhaY = eixoY + passoY * i;
    doc.setDrawColor(...COR.cinzaClaro);
    doc.setLineWidth(0.1);
    doc.line(eixoX, linhaY, eixoX + larguraPlot, linhaY);
    doc.setTextColor(...COR.cinza);
    doc.text(fmt(maximo - ((maximo - minimo) * i) / linhasGrade, casas), eixoX - 1.6, linhaY + 1.1, {
      align: 'right',
    });
  }

  const px = (indice) =>
    dados.length === 1
      ? eixoX + larguraPlot / 2
      : eixoX + (larguraPlot * indice) / (dados.length - 1);
  const py = (valor) => eixoY + alturaPlot - ((valor - minimo) / (maximo - minimo)) * alturaPlot;

  doc.setDrawColor(...cor);
  doc.setLineWidth(0.6);
  for (let i = 1; i < dados.length; i += 1) {
    doc.line(px(i - 1), py(dados[i - 1].valor), px(i), py(dados[i].valor));
  }

  doc.setFillColor(...cor);
  dados.forEach((item, i) => doc.circle(px(i), py(item.valor), 0.7, 'F'));

  const marcas = dados.length <= 3
    ? dados.map((_, i) => i)
    : [0, Math.floor((dados.length - 1) / 2), dados.length - 1];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(...COR.cinza);
  marcas.forEach((indice, posicao) => {
    const alinhamento = posicao === 0 ? 'left' : posicao === marcas.length - 1 ? 'right' : 'center';
    doc.text(String(dados[indice].rotulo), px(indice), eixoY + alturaPlot + 4, {
      align: alinhamento,
    });
  });

  const ultimo = dados[dados.length - 1];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(...COR.cinza);
  doc.text(
    `Média ${fmt(media(valores), casas)} ${unidade} • Atual ${fmt(ultimo.valor, casas)} ${unidade}`,
    x + w,
    y + 4,
    { align: 'right' },
  );
}

function montarComparativo(historico, cards, metas) {
  const pesos = historico.map((item) => item.peso).filter((valor) => valor > 0);
  const imcs = historico.map((item) => item.imc).filter((valor) => valor > 0);

  const pesoInicial = pesos[0] ?? null;
  const pesoAtual = pesos.at(-1) ?? null;
  const imcInicial = imcs[0] ?? null;
  const imcAtual = imcs.at(-1) ?? null;
  const altura = pesoAtual && imcAtual ? Math.sqrt(pesoAtual / imcAtual) : null;

  const imcAlvo = numero(metas?.imcAlvo);
  const pesoAlvoInformado = numero(metas?.pesoAlvo);
  const pesoAlvo = pesoAlvoInformado
    ?? (imcAlvo && altura ? arredondar(imcAlvo * altura * altura, 1) : null);

  const linhas = [];

  if (pesoAlvo && pesoAtual && pesoInicial) {
    const emagrecimento = pesoAlvo <= pesoInicial;
    const distanciaTotal = Math.abs(pesoInicial - pesoAlvo);
    const percorrido = emagrecimento ? pesoInicial - pesoAtual : pesoAtual - pesoInicial;
    const progresso = distanciaTotal > 0
      ? percorrido / distanciaTotal
      : (percorrido >= 0 ? 1 : 0);
    const atingida = emagrecimento ? pesoAtual <= pesoAlvo : pesoAtual >= pesoAlvo;
    linhas.push({
      meta: 'Peso corporal',
      alvo: `${fmt(pesoAlvo, 1)} kg${pesoAlvoInformado ? '' : ' (estimado)'}`,
      atual: `${fmt(pesoAtual, 1)} kg`,
      progresso: Math.max(0, Math.min(1, progresso)),
      status: atingida ? 'Atingida' : progresso > 0 ? 'Em andamento' : 'Não atingida',
    });
  }

  if (imcAlvo && imcAtual && imcInicial) {
    const distanciaInicial = Math.abs(imcInicial - imcAlvo);
    const distanciaAtual = Math.abs(imcAtual - imcAlvo);
    const progresso = distanciaInicial > 0
      ? 1 - distanciaAtual / distanciaInicial
      : (distanciaAtual === 0 ? 1 : 0);
    linhas.push({
      meta: 'IMC',
      alvo: `${fmt(imcAlvo, 1)} (ideal 18,5–24,9)`,
      atual: `${fmt(imcAtual, 1)} — ${classificarImc(imcAtual)}`,
      progresso: Math.max(0, Math.min(1, progresso)),
      status: distanciaAtual <= 0.5 ? 'Atingida' : progresso > 0 ? 'Em andamento' : 'Não atingida',
    });
  }

  const metaSemanal = numero(metas?.treinosSemana) ?? numero(cards?.metaSemanal) ?? 3;
  const treinosSemana = numero(cards?.treinosSemana) ?? 0;
  if (metaSemanal > 0) {
    linhas.push({
      meta: 'Constância semanal',
      alvo: `${metaSemanal} treinos`,
      atual: `${treinosSemana} treinos na semana`,
      progresso: Math.min(1, treinosSemana / metaSemanal),
      status: treinosSemana >= metaSemanal ? 'Atingida' : treinosSemana > 0 ? 'Em andamento' : 'Não atingida',
    });
  }

  return { linhas, pesoAlvo, pessoaPesoAlvo: Boolean(pesoAlvoInformado), altura, imcAlvo, pesoInicial, pesoAtual, imcAtual };
}

export function gerarRelatorioPdf({ usuario = {}, historico = [], cards = {}, metas = {}, detalhesCorporais = {} } = {}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  cabecalho(doc);

  const comparativo = montarComparativo(historico, cards, metas);
  const mediaTmb = media(historico.map((item) => item.tmb).filter((valor) => valor > 0));
  const mediaNdc = media(historico.map((item) => item.ndc).filter((valor) => valor > 0));
  const variacaoPeso = comparativo.pesoInicial !== null && comparativo.pesoAtual !== null
    ? comparativo.pesoAtual - comparativo.pesoInicial
    : null;

  let y = 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(...COR.preto);
  doc.text('RELATÓRIO DE EVOLUÇÃO FÍSICA', MARGEM, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...COR.cinza);
  doc.text('Histórico de medidas corporais, curvas de IMC/TMB/NDC e comparativo de metas.', MARGEM, y);
  y += 6;

  doc.setFillColor(...COR.amarelo);
  doc.roundedRect(MARGEM, y, 104, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COR.preto);
  doc.text('PREPARADO PARA NUTRICIONISTA / PERSONAL TRAINER', MARGEM + 3, y + 4.8);
  y += 14;

  y = secao(doc, y, 'Dados do paciente');
  const periodo = historico.length
    ? `${historico[0].data} a ${historico.at(-1).data}`
    : 'Sem medições registradas';

  const bioTexto = detalhesCorporais?.alturaCm
    ? `${detalhesCorporais.genero || '—'} • ${detalhesCorporais.idade || '—'} anos • ${detalhesCorporais.alturaCm} cm`
    : 'Perfil inicial';

  const campos = [
    ['Paciente', usuario.nome || 'Não informado'],
    ['E-mail', usuario.email || 'Não informado'],
    ['Perfil Biométrico', bioTexto],
    ['Nível de Atividade', detalhesCorporais?.nivelAtividade || 'Moderado'],
    ['Período analisado', periodo],
    ['Consolidação', `${historico.length} medições (1 diária)`],
  ];
  const larguraCampo = (LARGURA_PAGINA - MARGEM * 2 - 6) / 2;
  campos.forEach(([rotulo, valor], indice) => {
    const coluna = indice % 2;
    const linha = Math.floor(indice / 2);
    caixa(doc, {
      x: MARGEM + coluna * (larguraCampo + 6),
      y: y + linha * 21,
      w: larguraCampo,
      h: 17,
      rotulo,
      valor,
    });
  });
  y += 3 * 21 + 4;

  y = secao(doc, y, 'Resumo executivo');
  const larguraResumo = (LARGURA_PAGINA - MARGEM * 2 - 10) / 3;
  const resumo = [
    {
      rotulo: 'Peso inicial',
      valor: comparativo.pesoInicial !== null ? `${fmt(comparativo.pesoInicial, 1)} kg` : '—',
      detalhe: historico.length ? historico[0].data : '',
    },
    {
      rotulo: 'Peso atual',
      valor: comparativo.pesoAtual !== null ? `${fmt(comparativo.pesoAtual, 1)} kg` : '—',
      detalhe: historico.length ? historico.at(-1).data : '',
    },
    {
      rotulo: 'Variação de peso',
      valor: variacaoPeso !== null
        ? `${variacaoPeso > 0 ? '+' : ''}${fmt(variacaoPeso, 1)} kg`
        : '—',
      detalhe: 'no período analisado',
    },
    {
      rotulo: 'IMC atual',
      valor: comparativo.imcAtual !== null ? fmt(comparativo.imcAtual, 1) : '—',
      detalhe: classificarImc(comparativo.imcAtual),
    },
    {
      rotulo: 'TMB média',
      valor: mediaTmb !== null ? fmt(Math.round(mediaTmb), 0) : '—',
      detalhe: 'kcal/dia',
    },
    {
      rotulo: 'NDC média',
      valor: mediaNdc !== null ? fmt(Math.round(mediaNdc), 0) : '—',
      detalhe: 'kcal/dia',
    },
  ];
  resumo.forEach((item, indice) => {
    const coluna = indice % 3;
    const linha = Math.floor(indice / 3);
    caixa(doc, {
      x: MARGEM + coluna * (larguraResumo + 5),
      y: y + linha * 24,
      w: larguraResumo,
      h: 21,
      ...item,
    });
  });
  y += 2 * 24 + 4;

  y = secao(doc, y, 'Comparativo de metas');

  const estiloTabela = {
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 2.6,
      textColor: COR.preto,
      lineColor: COR.cinzaClaro,
      lineWidth: 0.15,
    },
    headStyles: { fillColor: COR.preto, textColor: COR.branco, fontStyle: 'bold', fontSize: 8.5 },
    alternateRowStyles: { fillColor: [252, 252, 252] },
  };

  if (comparativo.linhas.length) {
    autoTable(doc, {
      ...estiloTabela,
      startY: y,
      margin: { left: MARGEM, right: MARGEM },
      head: [['Meta', 'Alvo', 'Situação atual', 'Progresso', 'Status']],
      body: comparativo.linhas.map((linha) => [
        linha.meta,
        linha.alvo,
        linha.atual,
        `${Math.round(linha.progresso * 100)}%`,
        linha.status,
      ]),
      columnStyles: {
        3: { halign: 'center', fontStyle: 'bold' },
        4: { halign: 'center', fontStyle: 'bold' },
      },
      didParseCell: (data) => {
        if (data.section !== 'body' || data.column.index !== 4) return;
        const cores = {
          Atingida: COR.verde,
          'Em andamento': COR.mostarda,
          'Não atingida': COR.vermelho,
        };
        data.cell.styles.textColor = cores[data.cell.raw] || COR.preto;
      },
    });
    y = (doc.lastAutoTable?.finalY ?? y) + 6;
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...COR.cinza);
    doc.text(
      'Defina as metas e registre ao menos uma medição para gerar o comparativo.',
      MARGEM,
      y + 4,
    );
    y += 12;
  }

  const notas = [];
  if (comparativo.altura) {
    notas.push(
      `Altura estimada: ${fmt(comparativo.altura * 100, 0)} cm (derivada do peso e do IMC da última medição).`,
    );
  }
  if (comparativo.pesoAlvo && !comparativo.pessoaPesoAlvo) {
    notas.push(
      `Peso alvo estimado a partir do IMC alvo (${fmt(comparativo.imcAlvo, 1)}) para a altura calculada.`,
    );
  }
  if (cards.totalTreinos !== undefined) {
    notas.push(
      `Treinos registrados: ${cards.totalTreinos ?? 0} • Séries concluídas: ${cards.totalExercicios ?? 0} • Tempo treinado: ${fmt(cards.tempoTreinado ?? 0, 1)} h • Gasto calórico estimado: ${Number(cards.calorias ?? 0).toLocaleString('pt-BR')} kcal.`,
    );
  }
  if (detalhesCorporais?.faixaPesoIdeal?.min) {
    notas.push(
      `Faixa de peso ideal (OMS 18,5–24,9): ${detalhesCorporais.faixaPesoIdeal.min} kg a ${detalhesCorporais.faixaPesoIdeal.max} kg para a altura de ${detalhesCorporais.alturaCm} cm.`,
    );
  }
  if (detalhesCorporais?.metaEmagrecimento) {
    notas.push(
      `Metas calóricas diárias estimadas: Déficit/Emagrecimento (~${detalhesCorporais.metaEmagrecimento} kcal) • Manutenção (${Math.round(detalhesCorporais.ndcAtual || 0)} kcal) • Superávit/Hipertrofia (~${detalhesCorporais.metaHipertrofia} kcal).`,
    );
  }
  if (detalhesCorporais?.aguaDiariaLitros) {
    notas.push(
      `Ingestão de água recomendada: ${detalhesCorporais.aguaDiariaLitros} L/dia (35 ml por kg de peso corporal).`,
    );
  }
  if (detalhesCorporais?.macros?.proteinaG) {
    notas.push(
      `Divisão sugerida de macronutrientes: Proteínas ${detalhesCorporais.macros.proteinaG}g • Carboidratos ${detalhesCorporais.macros.carboG}g • Gorduras ${detalhesCorporais.macros.gorduraG}g.`,
    );
  }
  if (notas.length) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(...COR.cinza);
    notas.forEach((nota) => {
      const linhas = doc.splitTextToSize(`• ${nota}`, LARGURA_PAGINA - MARGEM * 2);
      doc.text(linhas, MARGEM, y + 3);
      y += linhas.length * 3.6 + 1;
    });
  }

  doc.addPage();
  cabecalho(doc);
  let yc = 24;
  yc = secao(doc, yc, 'Curvas de evolução (peso, IMC, TMB e NDC)');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COR.cinza);
  doc.text(
    'Cada ponto representa uma medição registrada e as linhas conectam os registros em ordem cronológica.',
    MARGEM,
    yc,
  );
  yc += 6;

  const larguraGrafico = (LARGURA_PAGINA - MARGEM * 2 - 8) / 2;
  const alturaGrafico = 84;
  const series = [
    { titulo: 'Peso', unidade: 'kg', campo: 'peso', cor: COR.amareloEscuro, casas: 1 },
    { titulo: 'IMC', unidade: 'kg/m²', campo: 'imc', cor: COR.verde, casas: 1 },
    { titulo: 'TMB', unidade: 'kcal', campo: 'tmb', cor: COR.azul, casas: 0 },
    { titulo: 'NDC', unidade: 'kcal', campo: 'ndc', cor: COR.roxo, casas: 0 },
  ];
  series.forEach((serie, indice) => {
    const coluna = indice % 2;
    const linha = Math.floor(indice / 2);
    const dados = historico
      .map((item) => ({ rotulo: item.data, valor: numero(item[serie.campo]) }))
      .filter((item) => item.valor !== null);
    desenharGrafico(doc, {
      x: MARGEM + coluna * (larguraGrafico + 8),
      y: yc + linha * (alturaGrafico + 10),
      w: larguraGrafico,
      h: alturaGrafico,
      ...serie,
      dados,
    });
  });

  doc.addPage();
  cabecalho(doc);
  let yh = 24;
  yh = secao(doc, yh, 'Histórico de medidas');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COR.cinza);
  doc.text('Todas as medições corporais registradas, em ordem cronológica.', MARGEM, yh);
  yh += 5;

  if (historico.length) {
    autoTable(doc, {
      ...estiloTabela,
      startY: yh,
      margin: { left: MARGEM, right: MARGEM },
      head: [['Data', 'Peso (kg)', 'IMC', 'Classificação (OMS)', 'TMB (kcal/dia)', 'NDC (kcal/dia)']],
      body: historico.map((item) => [
        item.data,
        fmt(item.peso, 1),
        fmt(item.imc, 1),
        classificarImc(item.imc),
        fmt(item.tmb, 0),
        fmt(item.ndc, 0),
      ]),
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'right' },
        2: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' },
      },
      didDrawPage: () => cabecalho(doc),
    });
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COR.cinza);
    doc.text('Nenhuma medição corporal registrada até o momento.', MARGEM, yh + 6);
  }

  rodapes(doc);

  const data = new Date().toISOString().slice(0, 10);
  const nomeArquivo = `ironfit-relatorio-${slug(usuario.nome)}-${data}.pdf`;
  doc.save(nomeArquivo);
  return nomeArquivo;
}

export default gerarRelatorioPdf;
