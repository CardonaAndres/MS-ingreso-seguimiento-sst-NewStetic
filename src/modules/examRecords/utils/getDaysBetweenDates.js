export const getDaysBetweenDates = (dateMade, expirationDate) => {
    const startDate = new Date(dateMade);
    const endDate = new Date(expirationDate);

    // Verificar que la fecha de expiración no sea menor que la fecha inicial
    if (endDate < startDate) {
        const err = new Error('La fecha de expiración no puede ser menor que la fecha inicial.');
        err.status = 409;
        throw err;
    }

    // Calcular la diferencia en milisegundos
    const msDiff = endDate - startDate;

    // Convertir a días, redondeado al día más cercano
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysDifference = Math.round(msDiff / msPerDay);

    // Retornar resultado
    return {
        totalDays: daysDifference,
        isExpired: false,
        daysRemaining: daysDifference,
        message: `Faltan ${daysDifference} día(s) para la expiración.`
    };
};
