export const validateDates = (dateMade, expirationDate) => {
    if (!dateMade || !expirationDate) {
        const err = new Error('Ambas fechas (fecha de creación y fecha de expiración) son obligatorias.');
        err.status = 400;
        throw err;
    }

    const startDate = new Date(dateMade);
    const endDate = new Date(expirationDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        const err = new Error('Una o ambas fechas no son válidas.');
        err.status = 400;
        throw err;
    }

    if (endDate < startDate) {
        const err = new Error('La fecha de expiración no puede ser menor que la fecha inicial.');
        err.status = 409;
        throw err;
    }

    const msDiff = endDate - startDate;

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysDifference = Math.round(msDiff / msPerDay);

    return {
        message: `Faltan ${daysDifference} día(s) para la expiración.`
    };
};
