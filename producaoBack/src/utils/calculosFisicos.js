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
    if (
        genero.toLowerCase() === "masculino"
    ) {
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
        Sedentario: 1.2,
        Leve: 1.375,
        Moderado: 1.55,
        Intenso: 1.725,
        MuitoIntenso: 1.9
    };
    return Number(
        (
            tmb * fatores[nivelAtividade]
        ).toFixed(2)
    );
}