import { throwError } from "../../../app/utils/throw.error.js";
import { PermissionModel } from '../models/permissions.model.js';

export const authorize = (codePermission) => {
    return async (req, _res, next) => {
        try {
            const userPermission = await PermissionModel.getUserPermission(
                req.user.username, codePermission
            );
            
            if(!userPermission)
                throwError('Este usuario no tiene permiso para realizar esta acción', 403)

            next();
        } catch (err) {
            next(err);
        }
    }
}