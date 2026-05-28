export function calcularIMC(peso, alturaCm) {

    const alturaM = alturaCm / 100;

    return Number(
        (peso / (alturaM ** 2)).toFixed(2)
    );
}

export function calcularTMB(
    peso,
    alturaCm,
    idade,
    genero
) {

    if (genero === "masculino") {

        return Number(
            (
                (10 * peso) +
                (6.25 * alturaCm) -
                (5 * idade) +
                5
            ).toFixed(2)
        );
    }

    return Number(
        (
            (10 * peso) +
            (6.25 * alturaCm) -
            (5 * idade) -
            161
        ).toFixed(2)
    );
}

export function calcularNDC(
    tmb,
    nivelAtividade
) {

    const fatores = {
        sedentario: 1.2,
        leve: 1.375,
        moderado: 1.55,
        intenso: 1.725,
        muitoIntenso: 1.9
    };

    return Number(
        (
            tmb * fatores[nivelAtividade]
        ).toFixed(2)
    );
}