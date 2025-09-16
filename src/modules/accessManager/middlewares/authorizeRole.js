import { RolesModel } from '../models/roles.model.js'
import { throwError } from "../../../app/utils/throw.error.js";

export const authorizeRole = (rolesIDs = []) => {
    return async (req, _res, next) => {
        try {
            const userValid = await RolesModel.getRoleByUsername(req.user.username, rolesIDs);

            if (!userValid) 
                throwError("Este usuario no tiene el rol necesario para esta acción", 403);

            next();
        } catch (err) {
            next(err);
        }
    }
}