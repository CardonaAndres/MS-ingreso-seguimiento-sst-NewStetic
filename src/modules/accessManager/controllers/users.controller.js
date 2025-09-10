import { UserAccessModel } from "../models/users.model.js";
import { throwError } from '../../../app/utils/throw.error.js';
import { UserValidator } from "../utils/user.validator.js";

export class UserAccesController {
    static async getAllowedUsers(_req, res, next){
        try {
            const usersAllowed = await UserAccessModel.getAllowerdUsers();

            return res.status(200).json({
                message: 'Todos los usuarios autorizados para usar el aplicativo',
                users: usersAllowed
            });

        } catch (err) {
            next(err);
        }
    }

    static async giveAccess(req, res, next){
        try {
            UserValidator.validateUserInfo(req.body);

            return res.status(201).json({
                message: `Al usuario ${req.body.username} se le ha dado acceso de manera correcta`
            });

        } catch (err) {
            next(err);
        }
    }
}