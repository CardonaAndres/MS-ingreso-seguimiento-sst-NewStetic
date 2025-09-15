import sql from 'mssql';
import { ConnDataBase } from '../../../app/utils/conn.database.js';

const conn = await new ConnDataBase().connect(String(process.env.DB_SST_NAME));

export class RolesModel {
    static async getRoles(){
        const result = await conn.request().query(`SELECT * FROM roles`);
        return result.recordset
    }

    static async getRoleByID(roleID){
        const result = await conn.request()
         .input('roleID', sql.Int, roleID)
         .query(`SELECT * FROM roles WHERE rol_id = @roleID`);
         
        return result.recordset[0]
    }

}