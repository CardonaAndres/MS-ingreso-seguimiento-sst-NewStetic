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
}