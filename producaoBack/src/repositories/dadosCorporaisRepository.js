import prisma from "../database/prismaClient.js";
import {
    calcularIMC,
    calcularTMB,
    calcularNDC
}
    from "../utils/calculosFisicos.js";

const includesPadrao = {usuario: true,
    calculos: {
        orderBy: {data_calculo: "desc"},
        include: {treinos: true}
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
        return await transaction.dadosCorporais.create({
            data: {
                idUsuario:Number(dados.idUsuario),
                peso_kg:Number(dados.peso_kg),
                altura_cm:Number(dados.altura_cm),
                genero,
                idade:Number(dados.idade),
                nivel_atividade,
                calculos: {
                    create: {imc: calculos.imc,tmb: calculos.tmb,ndc: calculos.ndc
                    }
                }
            },
            include: includesPadrao
        });
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
    findByUsuario: async (idUsuario) => {
    return await prisma.dadosCorporais.findFirst({
        where: {
            idUsuario: Number(idUsuario)
        },
        include: includesPadrao
    });
},
    // UPDATE
    atualizarDados: async (
        idUsuario,
        dados,
        transaction = prisma
    ) => {
        const genero =
            normalizarGenero(dados.genero);
        const nivel_atividade =
            normalizarNivelAtividade(
                dados.nivel_atividade
            );
        const calculos = gerarCalculos({
            ...dados,
            genero,
            nivel_atividade
        });
        return await transaction.dadosCorporais.update({
            where: {
                idUsuario: Number(idUsuario)
            },
            data: {
                peso_kg:Number(dados.peso_kg),
                altura_cm:Number(dados.altura_cm),
                genero,
                idade:Number(dados.idade),
                nivel_atividade,
                // cria histórico
                calculos: {
                    create: {
                        imc: calculos.imc,
                        tmb: calculos.tmb,
                        ndc: calculos.ndc
                    }
                }
            },
            include: includesPadrao
        });
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

