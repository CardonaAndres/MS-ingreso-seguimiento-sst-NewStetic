import sql from 'mssql';
import { ConnDataBase } from '../../../app/utils/conn.database.js';
import { throwError } from '../../../app/utils/throw.error.js';

const conn = await new ConnDataBase().connect(String(process.env.DB_SST_NAME));

export class UserAccessModel {
    static async getAllowerdUsers(){
        const result = await conn.request().query(`
            SELECT u.*, r.nombre, r.descripcion FROM usuarios u 
            INNER JOIN roles r ON u.rol_id = r.rol_id
        `);
        
        return result?.recordset
    }

    static async getUserByField(field, value){
        const allowedFields = {
            email: 'email',
            docNumber: 'numero_documento',
            username: 'username',
            userID: 'usuario_id'
        };

        const dbField = allowedFields[field];

        if (!dbField) 
            throwError(`Campo no soportado: ${field}`, 400);
        
        const result = await conn.request()
        .input(field, sql.VarChar, value)
        .query(`
            SELECT u.*, r.nombre, r.descripcion FROM usuarios u 
            INNER JOIN roles r ON u.rol_id = r.rol_id WHERE u.${dbField} = @${field}
        `);

        return result?.recordset[0];
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

    static async updateAcces(userInfo){
        const { 
            userID,
            username, 
            documentNumber, 
            email, 
            state,
            roleID
        } = userInfo;

        const result = await conn.request()
         .input('userID', sql.Int, userID)
         .input('username', sql.VarChar, username)
         .input('documentNumber', sql.VarChar, documentNumber)
         .input('email', sql.VarChar, email)
         .input('state', sql.VarChar, state)
         .input('roleID', sql.Int, roleID)
         .query(`
            UPDATE usuarios
                SET 
                    username = @username,
                    numero_documento = @documentNumber,
                    email = @email,
                    estado = @state,
                    rol_id = @roleID
            WHERE usuario_id = @userID
        `);

        return result.rowsAffected[0] > 0;
    }
}