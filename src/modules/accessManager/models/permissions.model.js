import sql from 'mssql';
import { ConnDataBase } from '../../../app/utils/conn.database.js';

const conn = await new ConnDataBase().connect(String(process.env.DB_SST_NAME));

export class PermissionModel {
    static async getPermissions(){
        const result = await conn.request().query(`SELECT * FROM permisos`);
        return result.recordset
    }

    static async getPermissionsByRole(roleID){        
        const result = await conn.request()
        .input('roleID', sql.Int, roleID)
        .query(`
            SELECT p.* FROM permisos p
            INNER JOIN roles_permisos rp 
            ON p.permiso_id = rp.permiso_id
            WHERE rp.rol_id = @roleID
        `);

        return result.recordset
    }
} 