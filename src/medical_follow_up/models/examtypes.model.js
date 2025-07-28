import { ConnDataBase } from '../../app/utils/conn.database.js';

const conn = new ConnDataBase().connect(String(process.env.DB_SST_NAME));

export class ExamTypesModel {
    static async ExamTypes() {
        const examTypes = await conn.request().query( `
            SELECT *,
                CASE WHEN nombre NOT IN ('Ingreso', 'Egreso') THEN 'Periodico' ELSE nombre END AS tipo_examen
            FROM tipos_examenes`
        );

        return examTypes.recordset;
    }
}