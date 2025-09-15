import sql from 'mssql';
import * as queries from '../utils/examChekList.queries.js';
import { ConnDataBase } from '../../../app/utils/conn.database.js';

const conn = await new ConnDataBase().connect(String(process.env.DB_SST_NAME));

export class ExamCheckListModel {
    static async getCheckList(userDocument){
        const result = await conn.request()
         .input('userDocument', sql.NVarChar, userDocument)
         .query(queries.getCheckList);

        return result.recordset
    }

    static async getCheckListItemByID(CheckListItemByID){
        const result = await conn.request()
         .input('CheckListItemByID', sql.Int, parseInt(CheckListItemByID))
         .query(`
             SELECT chls.*, texm.nombre, texm.estado as estado_tipoexamen
             FROM checklist_examenes chls INNER JOIN tipos_examenes texm 
             ON texm.tipo_examen_id = chls.tipo_examen_id 
             WHERE chls.checklist_id = @CheckListItemByID
         `);

        return result.recordset[0]
    }

    static async hasUserExamInChecklist(examTypeId, userDocument){
        const result = await conn.request()
         .input('examTypeId', sql.Int, examTypeId)
         .input('userDocument', sql.NVarChar, userDocument)
         .query(`
             SELECT chls.*, texm.nombre, texm.estado
             FROM checklist_examenes chls INNER JOIN tipos_examenes texm 
             ON texm.tipo_examen_id = chls.tipo_examen_id 
             WHERE chls.cc_empleado = @userDocument AND texm.tipo_examen_id = @examTypeId
         `);

        return result.recordset[0]
    }

    static async addCheckListItem(userDocument, examTypeId, isRequired){
        const result = await conn.request()
         .input('userDocument', sql.NVarChar, userDocument)
         .input('examTypeId', sql.Int, examTypeId)
         .input('isRequired', sql.NVarChar, isRequired)
         .query(`INSERT INTO checklist_examenes (cc_empleado, tipo_examen_id, es_requerido, estado)
            VALUES(@userDocument, @examTypeId, @isRequired, 'Activo')
         `)

        return result.rowsAffected[0] == 1
    }

    static async updateCheckListItem(examTypeId, isRequired, state, checkListItemID){
        const result = await conn.request()
         .input('checkListItemID', sql.Int, checkListItemID)
         .input('examTypeId', sql.Int, examTypeId)
         .input('isRequired', sql.NVarChar, isRequired)
         .input('state', sql.NVarChar, state)
         .query(`
            UPDATE checklist_examenes SET 
            tipo_examen_id = @examTypeId, 
            es_requerido = @isRequired,
            estado = @state
            WHERE checklist_id = @checkListItemID
         `)

        return result.rowsAffected[0] == 1
    }
}