import sql from 'mssql';
import { ConnDataBase } from '../../../app/utils/conn.database.js';

const conn = await new ConnDataBase().connect(String(process.env.DB_SST_NAME));

export class ExamLogsModel {
    static async getLogs(examItemID){
        const results = await conn.request()
         .input('examItemID', sql.Int, examItemID)
         .query(`
            SELECT * FROM checklist_items_logs 
            WHERE checklist_item_id = @examItemID 
            ORDER BY fecha_accion
         `);

        return results.recordset;
    }

    static async create(logInfo){
        const { 
            checkListItemID,
            action,
            observations,
            responsibleUser
        } = logInfo;

        const result = await conn.request()
         .input('checkListItemID', sql.Int, checkListItemID)
         .input('action', sql.VarChar, action)
         .input('observations', sql.Text, observations)
         .input('responsibleUser', sql.NVarChar, responsibleUser)
         .query(`
            INSERT INTO checklist_items_logs (
                checklist_item_id, 
                accion, 
                observaciones,
                usuario_responsable
            ) VALUES (
                @checkListItemID, 
                @action, 
                @observations,
                @responsibleUser
            )     
         `);

        return {
            success: result.rowsAffected[0] == 1,
        }
    }
}