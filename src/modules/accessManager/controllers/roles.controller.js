import { RolesModel } from "../models/roles.model.js";

export class RoleController {
    static async getRoles(_req, res, next){
        try {
            const roles = await RolesModel.getRoles();

            return res.status(200).json({
                roles
            });

        } catch (err) {
            next(err);
        }
    }
}