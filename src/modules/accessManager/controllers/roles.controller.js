import NodeCache from "node-cache";
import { RolesModel } from "../models/roles.model.js";
import { PermissionModel } from './../models/permissions.model.js';

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
}