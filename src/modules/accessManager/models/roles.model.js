import { ConnDataBase } from '../../../app/utils/conn.database.js';

const conn = new ConnDataBase().connect(String(process.env.DB_SST_NAME));

export class RolesModel {
    static async getRoles(){
        const result = await conn.request().query(`SELECT * FROM roles`);
        return result.recordset
    }

}