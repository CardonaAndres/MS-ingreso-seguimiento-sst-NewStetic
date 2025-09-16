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

    static async getPermissionsByID(permissionID){        
        const result = await conn.request()
        .input('permissionID', sql.Int, permissionID)
        .query(`SELECT * FROM permisos WHERE permiso_id = @permissionID`);

        return result.recordset[0];
    }

    static async getUserPermissions(username){
        const result = await conn.request()
        .input('username', sql.VarChar, username)   
        .query(`
            SELECT 
                u.username,
                r.nombre as rol,
                p.nombre as permiso,
                p.code as codigo_permiso
            FROM usuarios u
            INNER JOIN roles r ON u.rol_id = r.rol_id
            INNER JOIN roles_permisos rp ON r.rol_id = rp.rol_id
            INNER JOIN permisos p ON rp.permiso_id = p.permiso_id
            WHERE u.username = @username
        `);

        return result.recordset;
    }

    static async getUserPermission(username, code){
       const result = await conn.request()
        .input('code', sql.VarChar, code)
        .input('username', sql.VarChar, username)   
        .query(`
            SELECT 
                u.username,
                r.nombre as rol,
                p.nombre as permiso,
                p.code as codigo_permiso
            FROM usuarios u
            INNER JOIN roles r ON u.rol_id = r.rol_id
            INNER JOIN roles_permisos rp ON r.rol_id = rp.rol_id
            INNER JOIN permisos p ON rp.permiso_id = p.permiso_id
            WHERE u.username = @username AND p.code = @code
        `);

        return result.recordset[0];
    }

    static async associatePermission(roleAndPermissionsInfo){
        const { roleID, permissionID } = roleAndPermissionsInfo;

        await conn.request()
        .input("roleID", sql.Int, roleID)
        .input("permissionID", sql.Int, permissionID)
        .query(`
            INSERT INTO roles_permisos (rol_id, permiso_id)
            VALUES (@roleID, @permissionID)
        `);
    }

    static async removePermissionsFromRole(roleID){
        await conn.request()
        .input('roleID', sql.Int, roleID)
        .query(`DELETE FROM roles_permisos WHERE rol_id = @roleID`);
    }
} 