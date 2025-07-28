import { ConnDataBase } from '../../app/utils/conn.database.js';

const conn = new ConnDataBase().connect(String(process.env.DB_SST_NAME));

export class ExamTypesModel {
    static async examTypes() {
        const examTypes = await conn.request().query( `
            SELECT *,
                CASE WHEN nombre NOT IN ('Ingreso', 'Egreso') THEN 'Periodico' ELSE nombre END AS tipo_examen
            FROM tipos_examenes`
        );

        return examTypes.recordset;
    }

    static async createExamType(examType) {
        const result = await conn.request().input('nombre', examType).query(`
            INSERT INTO tipos_examenes (nombre, estado) VALUES (@nombre, 'Activo')
        `);

        return result
    }

    static async updateExamType(examTypeId, name, state) {
        const result = await conn.request()
            .input('tipo_examen_id', examTypeId)
            .input('nombre', name).input('estado', state)
            .query(`UPDATE tipos_examenes 
                SET nombre = @nombre, estado = @estado 
                WHERE tipo_examen_id = @tipo_examen_id`
            );

        return result;
    }
}