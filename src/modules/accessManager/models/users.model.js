import sql from 'mssql';
import { ConnDataBase } from '../../../app/utils/conn.database.js';

const conn = new ConnDataBase().connect(String(process.env.DB_SST_NAME));

export class UserAccessModel {
    static async getAllowerdUsers(){
        const result = await conn.request().query(`
            SELECT u.*, r.nombre, r.descripcion FROM usuarios u 
            INNER JOIN roles r ON u.rol_id = r.rol_id
        `);
        
        return result?.recordset
    }

    static async getUserByUsername(username){
        const result = await conn.request().input('username', sql.VarChar, username).query(`
            SELECT u.*, r.nombre, r.descripcion FROM usuarios u 
            INNER JOIN roles r ON u.rol_id = r.rol_id 
            WHERE u.username = @username
        `);
        
        return result?.recordset[0]
    }

    static async giveAccess(userInfo){
        const { 
            username, 
            documentNumber, 
            email = `${username}@newstetic.com`, 
            state = 'Activo',
            roleID
        } = userInfo;

        const result = await conn.request()
          .input('username', sql.VarChar, username)
          .input('documentNumber', sql.VarChar, documentNumber)
          .input('email', sql.VarChar, email)
          .input('state', sql.VarChar, state)
          .input('roleID', sql.Int, roleID)
        .query(`INSERT INTO usuarios (username, numero_documento, email, estado, rol_id) 
            VALUES (@username, @documentNumber, @email, @state, @roleID)
        `);

        return result.rowsAffected[0] > 0;
    }
}