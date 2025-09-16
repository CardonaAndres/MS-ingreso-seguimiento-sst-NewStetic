import NodeCache from "node-cache";
import { RolesModel } from "../models/roles.model.js";
import { PermissionModel } from './../models/permissions.model.js';
import { throwError } from '../../../app/utils/throw.error.js';

const cache = new NodeCache({ stdTTL: 1500 });

export class RoleController {
    static async getRoles(_req, res, next){
        try {
            const cachedRoles = cache.get("roles_with_permissions");

            if (cachedRoles) return res.status(200).json({ roles: cachedRoles });
            
            const roles = await RolesModel.getRoles();

            const rolesWithPermissions = await Promise.all(
                roles.map(async (role) => {
                    const permissions = await PermissionModel.getPermissionsByRole(role.rol_id);
                    return { ...role, permissions };
                })
            );

            return res.status(200).json({
                roles: rolesWithPermissions
            });

        } catch (err) {
            next(err);
        }
    }

    static async createRole(req, res, next){
        try {
            const { name, description, permissionIds } = req.body;

            if(name && name.length < 3)
                throwError('El campo "nombre" no puede tener menos de 3 caracteres.', 400)

            if(description && description.length <= 8)
                throwError('El campo "nombre" no puede tener menos de 8 caracteres.', 400)

            const roleID = await RolesModel.createRole({ name, description });

            for(const id of permissionIds){
                const permission = await PermissionModel.getPermissionsByID(id);
                
                if(!permission)
                    throwError("El permiso dado no ha sido encontrado", 404);

                await PermissionModel.associatePermission({ roleID, permissionID: id });
            }

            return res.status(201).json({
                message: 'Rol registrado correctamente'
            });

        } catch (err) {
            next(err);
        }
    }

    static async updateRole(req, res, next){
        try {
            const { name, description, permissionIds } = req.body;

            if (name && name.length < 3) 
                throwError('El campo "nombre" no puede tener menos de 3 caracteres.', 400);

            if (description && description.length <= 8) 
                throwError('El campo "descripción" no puede tener menos de 8 caracteres.', 400);
            
            const existingRole = await RolesModel.getRoleByID(req.params.roleID);

            if (!existingRole) 
                throwError("El rol no existe", 404);
            
            await RolesModel.updateRole({ roleID: req.params.roleID, name, description });

            if(permissionIds && Array.isArray(permissionIds)){
                await PermissionModel.removePermissionsFromRole(req.params.roleID);

                for (const permissionID of permissionIds) {
                    const permission = await PermissionModel.getPermissionsByID(permissionID);
                
                    if (!permission) 
                        throwError("El permiso dado no ha sido encontrado", 404);

                    await PermissionModel.associatePermission({ 
                        roleID: req.params.roleID, permissionID 
                    });
                }
            }

            return res.status(200).json({
                message: 'Rol actualizado correctamente'
            });

        } catch (err) {
            next(err);
        }
    }

}