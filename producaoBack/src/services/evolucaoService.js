import prisma from "../database/prismaClient.js";

const EvolucaoService = {

    gerarGrafico(historico) {

        if (!Array.isArray(historico)) {
            throw new Error(
                "Histórico corporal inválido"
            );
        }

        if (historico.length === 0) {

            return {
                peso: {
                    dados: [],
                    media: 0
                },

                imc: {
                    dados: [],
                    media: 0
                },

                tmb: {
                    dados: [],
                    media: 0
                },

                ndc: {
                    dados: [],
                    media: 0
                }
            };
        }

        // Deduplica por data ("DD/MM/AAAA"), mantendo a medição mais recente de cada dia para evitar quebras nos gráficos
        const historicoPorData = new Map();
        for (const item of historico) {
            const dataFormatada = new Date(item.criado_em).toLocaleDateString("pt-BR");
            historicoPorData.set(dataFormatada, item);
        }
        const historicoConsolidado = Array.from(historicoPorData.values());

        const separarDados = (campo) => {
            return historicoConsolidado.map(item => ({
                data: new Date(item.criado_em).toLocaleDateString("pt-BR"),
                valor: Number(item[campo])
            }));
        };

        const calcularMedia = (campo) => {
            const soma = historicoConsolidado.reduce(
                (total, item) => total + Number(item[campo]),
                0
            );

            return Number((soma / historicoConsolidado.length).toFixed(2));
        };

        return {
            peso: {
                dados: separarDados("peso_kg"),
                media: calcularMedia("peso_kg")
            },
            imc: {
                dados: separarDados("imc"),
                media: calcularMedia("imc")
            },
            tmb: {
                dados: separarDados("tmb"),
                media: calcularMedia("tmb")
            },
            ndc: {
                dados: separarDados("ndc"),
                media: calcularMedia("ndc")
            }
        };
    },

    async gerarEstatisticas(idUsuario) {
        const [treinos, historico, dadosCorporais] = await Promise.all([
            prisma.treino.findMany({
                where: {
                    OR: [
                        { idUsuario: String(idUsuario) },
                        {
                            calculo: {
                                dados: {
                                    idUsuario: String(idUsuario)
                                }
                            }
                        }
                    ]
                },
                select: {
                    data_criacao: true,
                    treinoExercicios: {
                        select: {
                            series: true,
                            repeticoes: true,
                            descanso_segundos: true,
                            grupo_muscular: true,
                            exercicio: {
                                select: { nome: true }
                            }
                        }
                    }
                },
                orderBy: { data_criacao: "asc" }
            }),
            prisma.historicoCorporal.findMany({
                where: {
                    dados: { idUsuario: String(idUsuario) }
                },
                select: {
                    idHistorico: true,
                    peso_kg: true,
                    altura_cm: true,
                    imc: true,
                    tmb: true,
                    ndc: true,
                    criado_em: true
                },
                orderBy: { criado_em: "asc" }
            }),
            prisma.dadosCorporais.findUnique({
                where: { idUsuario: String(idUsuario) },
                include: {
                    calculos: {
                        orderBy: { data_calculo: "desc" },
                        take: 1
                    }
                }
            })
        ]);

        const exerciciosPorNome = new Map();
        const gruposPorNome = new Map();
        let totalSeries = 0;
        let duracaoSegundos = 0;

        for (const treino of treinos) {
            for (const item of treino.treinoExercicios) {
                const series = Number(item.series) || 0;
                const repeticoes = Number(item.repeticoes) || 0;
                const descanso = Number(item.descanso_segundos) || 0;
                const nomeExercicio = item.exercicio?.nome || "Não informado";
                const grupo = item.grupo_muscular || "Não informado";

                totalSeries += series;
                duracaoSegundos += series * (repeticoes * 4 + descanso);
                exerciciosPorNome.set(
                    nomeExercicio,
                    (exerciciosPorNome.get(nomeExercicio) || 0) + series * repeticoes
                );
                gruposPorNome.set(
                    grupo,
                    (gruposPorNome.get(grupo) || 0) + series
                );
            }
        }

        const tempoMinutos = duracaoSegundos / 60;
        const calorias = Math.round(tempoMinutos * 5);
        const datasTreino = [...new Set(treinos.map((treino) => (
            new Date(treino.data_criacao).toISOString().slice(0, 10)
        )))];
        const inicioSemana = new Date();
        inicioSemana.setHours(0, 0, 0, 0);
        inicioSemana.setDate(inicioSemana.getDate() - ((inicioSemana.getDay() + 6) % 7));
        const treinosSemana = treinos.filter((treino) => (
            new Date(treino.data_criacao) >= inicioSemana
        )).length;
        let maiorSequencia = 0;
        let sequenciaAtual = 0;
        let dataAnterior = null;

        for (const data of datasTreino) {
            const dataAtual = new Date(`${data}T00:00:00Z`);
            const intervalo = dataAnterior
                ? (dataAtual - dataAnterior) / (24 * 60 * 60 * 1000)
                : 1;

            sequenciaAtual = intervalo === 1 ? sequenciaAtual + 1 : 1;
            maiorSequencia = Math.max(maiorSequencia, sequenciaAtual);
            dataAnterior = dataAtual;
        }

        const pesos = historico.map((item) => Number(item.peso_kg));
        const pesoInicial = pesos.length > 0 ? pesos[0] : (dadosCorporais ? Number(dadosCorporais.peso_kg) : 0);
        const pesoAtual = pesos.length > 0 ? pesos[pesos.length - 1] : (dadosCorporais ? Number(dadosCorporais.peso_kg) : 0);
        const pesoMinimo = pesos.length > 0 ? Math.min(...pesos) : pesoAtual;
        const pesoMaximo = pesos.length > 0 ? Math.max(...pesos) : pesoAtual;
        const variacaoPesoKg = Number((pesoAtual - pesoInicial).toFixed(1));
        const variacaoPercentual = pesoInicial > 0 ? Number(((variacaoPesoKg / pesoInicial) * 100).toFixed(1)) : 0;
        const maiorPerdaPeso = pesos.length > 1
            ? Math.max(0, pesos[0] - Math.min(...pesos))
            : 0;

        // Cálculos e Detalhes Biométricos enriquecidos
        const alturaCm = dadosCorporais ? Number(dadosCorporais.altura_cm) : 0;
        const alturaM = alturaCm / 100;
        const ultimoCalculo = dadosCorporais?.calculos?.[0];
        const imcAtual = ultimoCalculo ? Number(ultimoCalculo.imc) : (alturaM > 0 ? Number((pesoAtual / (alturaM ** 2)).toFixed(2)) : 0);
        const tmbAtual = ultimoCalculo ? Number(ultimoCalculo.tmb) : 0;
        const ndcAtual = ultimoCalculo ? Number(ultimoCalculo.ndc) : 0;

        const faixaPesoIdeal = alturaM > 0 ? {
            min: Number((18.5 * (alturaM ** 2)).toFixed(1)),
            max: Number((24.9 * (alturaM ** 2)).toFixed(1))
        } : { min: 0, max: 0 };

        const classificarImc = (val) => {
            if (!val || val <= 0) return "Não calculado";
            if (val < 18.5) return "Abaixo do peso";
            if (val < 25) return "Peso normal";
            if (val < 30) return "Sobrepeso";
            if (val < 35) return "Obesidade grau 1";
            if (val < 40) return "Obesidade grau 2";
            return "Obesidade grau 3";
        };

        const aguaDiariaLitros = pesoAtual > 0 ? Number(((pesoAtual * 35) / 1000).toFixed(2)) : 2.5;
        const metaEmagrecimento = ndcAtual > 0 ? Math.max(1200, Math.round(ndcAtual - 450)) : 0;
        const metaHipertrofia = ndcAtual > 0 ? Math.round(ndcAtual + 350) : 0;

        return {
            cards: {
                totalTreinos: treinos.length,
                totalExercicios: totalSeries,
                tempoTreinado: Number((tempoMinutos / 60).toFixed(1)),
                calorias,
                treinosSemana,
                metaSemanal: 3
            },
            detalhesCorporais: {
                pesoInicial,
                pesoAtual,
                pesoMinimo,
                pesoMaximo,
                variacaoPesoKg,
                variacaoPercentual,
                alturaCm,
                idade: dadosCorporais?.idade || 0,
                genero: dadosCorporais?.genero || "Não informado",
                nivelAtividade: dadosCorporais?.nivel_atividade || "Moderado",
                imcAtual,
                classificacaoImc: classificarImc(imcAtual),
                faixaPesoIdeal,
                tmbAtual,
                ndcAtual,
                metaEmagrecimento,
                metaHipertrofia,
                aguaDiariaLitros,
                macros: {
                    proteinaG: ndcAtual > 0 ? Math.round((ndcAtual * 0.30) / 4) : 0,
                    carboG: ndcAtual > 0 ? Math.round((ndcAtual * 0.40) / 4) : 0,
                    gorduraG: ndcAtual > 0 ? Math.round((ndcAtual * 0.30) / 9) : 0
                }
            },
            exercicios: [...exerciciosPorNome.entries()]
                .map(([nome, vezes]) => ({ nome, vezes }))
                .sort((a, b) => b.vezes - a.vezes),
            grupos: [...gruposPorNome.entries()]
                .map(([grupo, quantidade]) => ({ grupo, quantidade }))
                .sort((a, b) => b.quantidade - a.quantidade),
            recordes: {
                supinoMax: "0 kg",
                agachamentoMax: "0 kg",
                diasSeguidos: `${maiorSequencia} dias`,
                maiorPerdaPeso: `${Number(maiorPerdaPeso.toFixed(1))} kg`,
                totalHoras: `${Number((tempoMinutos / 60).toFixed(1))} hrs`,
                caloriasQueimadas: `${calorias} kcal`
            }
        };
    }
};


export default EvolucaoService;
