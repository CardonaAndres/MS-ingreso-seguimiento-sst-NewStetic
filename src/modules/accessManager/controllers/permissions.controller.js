import NodeCache from "node-cache";
import { PermissionModel } from "../models/permissions.model.js";

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
}