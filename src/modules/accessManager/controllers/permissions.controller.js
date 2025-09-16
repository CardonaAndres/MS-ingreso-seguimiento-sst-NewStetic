import NodeCache from "node-cache";
import { UserAccessModel } from "../models/users.model.js";
import { PermissionModel } from "../models/permissions.model.js";
import { throwError } from "../../../app/utils/throw.error.js";

const cache = new NodeCache({ stdTTL: 6 * 60 * 60 });

export class PermissionController {
    static async getAllPermisions(_req, res, next){
        try {
            const cachedPermissions = cache.get("all_permissions");

            if (cachedPermissions) {
                return res.status(200).json({
                    message: "Estos son todos los permisos (desde cache)",
                    permissions: cachedPermissions
                });
            }

            const permissions = await PermissionModel.getPermissions();

            cache.set("all_permissions", permissions);

            return res.status(200).json({
                message: 'Estos son todos los roles',
                permissions
            });

        } catch (err) {
            next(err);
        }
    }

    static async getPermissionsByRole(req, res, next){
        try {
            const permissions = await PermissionModel.getPermissionsByRole(req.params.roleID);

            if(!permissions) 
                return res.status(404).json({ message: "No se encontraron permisos para este rol" });

            return res.status(200).json({
                message: `Estos son los permisos del rol ${req.params.roleID}`,
                permissions
            });

        } catch (err) {
            next(err);
        }
    }

    static async getUserPermissions(req, res, next){
        try {
            const cacheKey = `user_permissions:${req.user.username}`;
            const cachedData = cache.get(cacheKey);

            if (cachedData) {
                return res.status(200).json({
                    message: "Permisos obtenidos desde cache para " + req.user.username,
                    ...cachedData
                });
            }

            const user = await UserAccessModel.getUserByField('username',req.user.username);

            if(!user) 
                throwError('El usuario no ha sido encontrado', 404);

            const permissions = await PermissionModel.getUserPermissions(req.user.username);

            cache.set(cacheKey, { permissions, user }, 5 * 60);

            return res.status(200).json({
                message: 'Los permisos del usuario: ' + req.user.username,
                permissions,
                user
            });

        } catch (err) {
            next(err);
        }
    }
}