import prisma from "../database/prismaClient.js";
import {
    calcularIMC,
    calcularTMB,
    calcularNDC
}
    from "../utils/calculosFisicos.js";

const includesPadrao = {
    usuario: true,
    calculos: {
        orderBy: { data_calculo: "desc" },
        include: { treinos: true }
    }
};

// NORMALIZA ENUMS DO PRISMA
function normalizarNivelAtividade(nivel) {
    const mapa = {
        sedentario: "Sedentario",
        leve: "Leve",
        moderado: "Moderado",
        intenso: "Intenso",
        muitointenso: "MuitoIntenso"
    };
    return mapa[nivel?.toString().replace(/\s/g, "").toLowerCase()];
}
function normalizarGenero(genero) {
    const mapa = {
        masculino: "Masculino",
        feminino: "Feminino",
        outro: "Outro"
    };
    return mapa[genero?.toString().trim().toLowerCase()];
}
// CENTRALIZA CÁLCULOS
function gerarCalculos(dados) {

    console.log(dados);
    const imc = calcularIMC(
        parseFloat(dados.peso_kg),
        parseFloat(dados.altura_cm)
    );
    const tmb = calcularTMB(
        parseFloat(dados.peso_kg),
        parseFloat(dados.altura_cm),
        parseFloat(dados.idade),
        dados.genero
    );
    const ndc = calcularNDC(tmb, dados.nivel_atividade);

    //testes de dados
    console.log({
        peso: dados.peso_kg,
        altura: dados.altura_cm,
        idade: dados.idade,
        genero: dados.genero,
        nivel: dados.nivel_atividade,
        imc,
        tmb,
        ndc
    });
    console.log(imc, tmb, ndc)
    if (Number.isNaN(imc) || Number.isNaN(tmb) || Number.isNaN(ndc)) {
        throw new Error(
            "Erro ao gerar cálculos corporais"
        );
    }
    return {
        imc,
        tmb,
        ndc
    };
}
const DadosCorporaisRepository = {
    // CREATE
    create: async (
        
        dados,
        transaction = prisma
    ) => {
        const genero =
            normalizarGenero(dados.genero);
        const nivel_atividade =
            normalizarNivelAtividade(
                dados.nivel_atividade
            );
        if (!genero) {
            throw new Error("Gênero inválido");
        }
        if (!nivel_atividade) {
            throw new Error(
                "Nível de atividade inválido"
            );
        }
        const calculos = gerarCalculos({
            ...dados,
            genero,
            nivel_atividade
        });
        await prisma.$transaction(async (tx) => {
        //inicia um registro novo para os dados corporais
        const registro = await tx.dadosCorporais.create({
            data: {
                idUsuario: Number(dados.idUsuario),
                peso_kg: Number(dados.peso_kg),
                altura_cm: Number(dados.altura_cm),
                genero,
                idade: Number(dados.idade),
                nivel_atividade,
                calculos: {
                    create: {
                        imc: calculos.imc, tmb: calculos.tmb, ndc: calculos.ndc
                    }
                }
            },
            include: includesPadrao
        });

        //snapshot (salvamento) do estado atual dos dados para o histórico Corporal
        await tx.historicoCorporal.create({
            data: {
                idDados: registro.idDados,

                peso_kg: Number(dados.peso_kg),
                altura_cm: Number(dados.altura_cm),

                genero,

                idade: Number(dados.idade),

                nivel_atividade,

                imc: calculos.imc,
                tmb: calculos.tmb,
                ndc: calculos.ndc
            }
        });
        return registro;
        })

    },
    // READ ALL
    findAll: async () => {
        return await prisma.dadosCorporais.findMany({
            include: includesPadrao
        });
    },
    // READ BY ID
    findById: async (idDados) => {
        return await prisma.dadosCorporais.findUnique({
            where: {
                idDados: Number(idDados)
            },
            include: includesPadrao
        });
    },
    // READ BY USER
    findByUsuario: async (
        idUsuario,
        transaction = prisma
    ) => {
        return await transaction.dadosCorporais.findUnique({
            where: {
                idUsuario: Number(idUsuario)
            },
            include: includesPadrao
        });
    },
    // UPDATE
atualizarDados: async (idUsuario,dados,transaction = prisma) => {

    // Normaliza os enums recebidos da API
    const genero =normalizarGenero(dados.genero);

    const nivel_atividade =normalizarNivelAtividade(dados.nivel_atividade);

    // Gera os cálculos atualizados
    const calculos = gerarCalculos({...dados, genero, nivel_atividade });

    // Executa tudo dentro de uma transação
    return await prisma.$transaction(async (tx) => {
            // Atualiza os dados atuais do usuário
            const registroAtualizado =await tx.dadosCorporais.update({
                    where: {idUsuario: Number(idUsuario)},
                    data: {
                        peso_kg: Number(dados.peso_kg),
                        altura_cm: Number(dados.altura_cm),
                        genero,
                        idade: Number(dados.idade),
                        nivel_atividade,
                        // Mantém o histórico de cálculos atual
                        calculos: {
                            create: {imc: calculos.imc, tmb: calculos.tmb, ndc: calculos.ndc}
                        }
                    },
                    include: includesPadrao
                });

            // Cria um snapshot completo para gráficos
            await tx.historicoCorporal.create({
                data: {
                    // Relaciona com DadosCorporais
                    idDados: registroAtualizado.idDados,
                    // Dados corporais da época
                    peso_kg: Number(dados.peso_kg),
                    altura_cm: Number(dados.altura_cm),
                    genero,
                    idade: Number(dados.idade),
                    nivel_atividade,
                    // Cálculos da época
                    imc: calculos.imc,
                    tmb: calculos.tmb,
                    ndc: calculos.ndc
                }
            });
            return registroAtualizado;
        }
    );
},
    // DELETE
    delete: async (
        idUsuario,
        transaction = prisma
    ) => {
        const dados =
            await transaction.dadosCorporais.findUnique({
                where: {
                    idUsuario: Number(idUsuario)
                }
            });
        if (!dados) {
            throw new Error(
                "Dados corporais não encontrados"
            );
        }

        // remove cálculos primeiro
        await transaction.calculo.deleteMany({
            where: {
                idDados: dados.idDados
            }
        });
        return await transaction.dadosCorporais.delete({
            where: {
                idUsuario: Number(idUsuario)
            }
        });
    }
};

export default DadosCorporaisRepository;

