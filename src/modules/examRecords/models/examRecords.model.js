import sql from 'mssql';
import { ConnDataBase } from '../../../app/utils/conn.database.js';

const conn = new ConnDataBase().connect(String(process.env.DB_SST_NAME));

export class ExamRecordsModel {
    static async getExamRecords(checkListItemID, page, limit){
        const resultExamRecords = await conn.request()
         .input('checkListItemID', sql.Int, checkListItemID)
         .input('page', sql.Int, page)
         .input('limit', sql.Int, limit)
         .query(`
            SELECT * FROM checklist_items 
            WHERE checklist_id = @checkListItemID
            ORDER BY checklist_item_id
            OFFSET (@page - 1) * @limit ROWS 
            FETCH NEXT @limit ROWS ONLY;
         `);

        const resultTotalExamRecords = await conn.request()
         .input('checkListItemID', sql.Int, checkListItemID)
         .query(`
            SELECT COUNT(*) AS totalExamRecords
            FROM checklist_items WHERE checklist_id = @checkListItemID
         `);

        return { 
            examRecords: resultExamRecords.recordset,
            totalExamRecords: resultTotalExamRecords.recordset[0].totalExamRecords
        }
    }

    static async create(itemInfo){
        const { 
            checkListItemID, 
            state = 'Pendiente', 
            dateMade =  new Date(),
            expirationDate,
            observations = 'Sin observaciones',
            PDF_url,
            totalDays
        } = itemInfo;

        const result = await conn.request()
         .input('checkListItemID', sql.Int, checkListItemID)
         .input('observations', sql.VarChar, observations)
         .input('dateMade', sql.Date, dateMade)
         .input('expirationDate', sql.Date, expirationDate)
         .input('totalDays', sql.Int, totalDays)
         .input('PDF_url', sql.VarChar, PDF_url)
         .input('state', sql.NVarChar, state)
         .query(`
            INSERT INTO checklist_items (
                observaciones, 
                fecha_realizado, 
                fecha_vencimiento,
                frecuencia_dias,
                PDF_url,
                estado,
                checklist_id
            ) VALUES (
                @observations, 
                @dateMade, 
                @expirationDate,
                @totalDays,
                @PDF_url,
                @state,
                @checkListItemID
            )

            SELECT SCOPE_IDENTITY() AS checklist_item_id;
         `);

        console.log(result.recordset) 

        return {
            success: result.rowsAffected[0] == 1,
            id: result.recordset[0].checklist_item_id
        }
    }
}