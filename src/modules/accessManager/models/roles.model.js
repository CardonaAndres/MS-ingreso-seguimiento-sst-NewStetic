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

    static async createRole(roleInfo){
        const { name, description } = roleInfo;

        const result = await conn.request()
         .input("name", sql.NVarChar, name)
         .input("description", sql.NVarChar, description || "Sin descripción")
         .query(`
            INSERT INTO roles (nombre, descripcion)
            OUTPUT INSERTED.rol_id AS role_id
            VALUES (@name, @description)
        `);

        return result.recordset[0].role_id;
    }

    static async updateRole(roleInfo){
        const { roleID, name, description } = roleInfo;

        await conn.request()
         .input("roleID", sql.Int, roleID)
         .input("name", sql.NVarChar, name)
         .input("description", sql.NVarChar, description || "Sin descripción")
         .query(`
            UPDATE Roles
            SET nombre = @name, descripcion = @description
            WHERE rol_id = @roleID;
        `);

    }

}   