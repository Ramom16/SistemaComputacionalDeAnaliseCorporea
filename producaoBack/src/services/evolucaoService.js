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

        const separarDados = (campo) => {

            return historico.map(item => ({

                data:
                    new Date(
                        item.criado_em
                    ).toLocaleDateString(
                        "pt-BR"
                    ),

                valor:
                    Number(item[campo])
            }));
        };


        const calcularMedia = (campo) => {

            const soma =
                historico.reduce(
                    (total, item) =>
                        total +
                        Number(item[campo]),
                    0
                );

            return Number(
                (
                    soma /
                    historico.length
                ).toFixed(2)
            );
        };


        return {

            peso: {
                dados:
                    separarDados("peso_kg"),

                media:
                    calcularMedia("peso_kg")
            },

            imc: {
                dados:
                    separarDados("imc"),

                media:
                    calcularMedia("imc")
            },

            tmb: {
                dados:
                    separarDados("tmb"),

                media:
                    calcularMedia("tmb")
            },

            ndc: {
                dados:
                    separarDados("ndc"),

                media:
                    calcularMedia("ndc")
            }
        };
    },

    async gerarEstatisticas(idUsuario) {
        const [treinos, historico] = await Promise.all([
            prisma.treino.findMany({
                where: {
                    calculo: {
                        dados: {
                            idUsuario: String(idUsuario)
                        }
                    }
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
                select: { peso_kg: true, criado_em: true },
                orderBy: { criado_em: "asc" }
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
        const maiorPerdaPeso = pesos.length > 1
            ? Math.max(0, pesos[0] - Math.min(...pesos))
            : 0;

        return {
            cards: {
                totalTreinos: treinos.length,
                totalExercicios: totalSeries,
                tempoTreinado: Number((tempoMinutos / 60).toFixed(1)),
                calorias
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