import sql from 'mssql';
import { ConnDataBase } from '../../../app/utils/conn.database.js';

export class PermissionsClass {
    static async syncPermissions(routes){
        try {
            let newPermissions = 0;
            let deletedPermissions = 0;
            let updatedPermissions  = 0;
            const conn = await new ConnDataBase().connect(String(process.env.DB_SST_NAME));
            const result = await conn.request().query(`SELECT * FROM permisos`);
            const routeCodes = new Set(routes.map(r => r.code));

            const dbPermissions = result.recordset.reduce((acc, row) => {
                acc[row.code] = row;
                return acc;
            }, {});

            for(const perm of routes){
                const existing = dbPermissions[perm.code];

                if (!existing) {
                    await conn.request()
                     .input('code', sql.VarChar, perm.code)
                     .input('nombre', sql.NVarChar, perm.name)
                     .input('descripcion', sql.NVarChar, perm.description || 'Sin descripción')
                     .query(`
                        INSERT INTO permisos (nombre, code, descripcion)
                        VALUES (@nombre, @code, @descripcion)
                     `);

                    newPermissions++;

                    continue;
                }

                const hasChanges =
                    existing.nombre !== perm.name ||
                    existing.descripcion !== perm.description ||
                    existing.code !== perm.code; 

                if (hasChanges) {
                    await conn.request()
                        .input('permiso_id', sql.Int, existing.permiso_id)
                        .input('code', sql.VarChar, perm.code)
                        .input('nombre', sql.NVarChar, perm.name)
                        .input('descripcion', sql.NVarChar, perm.description || 'Sin descripción')
                        .query(`
                            UPDATE permisos
                            SET code = @code,
                                nombre = @nombre,
                                descripcion = @descripcion
                            WHERE permiso_id = @permiso_id
                        `);

                    updatedPermissions++;
                        
                    continue;
                }

            }

            for (const dbCode in dbPermissions) {
                if (!routeCodes.has(dbCode)) {
                    await conn.request()
                     .input('permiso_id', sql.Int, dbPermissions[dbCode].permiso_id)
                     .query(`DELETE FROM permisos WHERE permiso_id = @permiso_id`);

                    deletedPermissions++;
                }
            }
            
            console.log(`🔄 Resumen sincronización de permisos: \n`);
            console.log(`🟢 Nuevos: ${newPermissions}`);
            console.log(`🟡 Actualizados: ${updatedPermissions}`);
            console.log(`🔴 Eliminados: ${deletedPermissions}`);
            console.log(`⚪ Sin cambios: ${routes.length - (newPermissions + updatedPermissions)}`);
            console.log(`✅ Total procesados (en código): ${routes.length}`);
            console.log(`📊 Total final en BD: ${routes.length}\n`);

        } catch (err) {
            console.error('❌ Error en syncPermissions:', err.message || err);
        }
    }
    
    static async syncAdminPermissions(routes){
        try {
            const conn = await new ConnDataBase().connect(String(process.env.DB_SST_NAME));

            await conn.request().query(`
                INSERT INTO roles_permisos (rol_id, permiso_id)
                SELECT r.rol_id, p.permiso_id
                FROM Roles r
                CROSS JOIN permisos p
                WHERE r.nombre = 'Admin'
                    AND NOT EXISTS (
                        SELECT 1 
                        FROM roles_permisos rp
                        WHERE rp.rol_id = r.rol_id
                        AND rp.permiso_id = p.permiso_id
                    );
            `);

            const codes = routes.map(r => `'${r.code}'`).join(", ");

            await conn.request().query(`
                DELETE rp
                FROM roles_permisos rp
                INNER JOIN Roles r ON rp.rol_id = r.rol_id
                INNER JOIN permisos p ON rp.permiso_id = p.permiso_id
                WHERE r.nombre = 'Admin'
                AND p.code NOT IN (${codes});
            `);

            console.log("✅ Permisos de Admin sincronizados correctamente \n");
        } catch (err) {
            console.error("❌ Error al sincronizar permisos de Admin:", err.message || err);
        }
    }
}