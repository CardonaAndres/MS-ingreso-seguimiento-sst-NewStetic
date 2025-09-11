import { UserAccessModel } from "../models/users.model.js";
import { throwError } from '../../../app/utils/throw.error.js';
import { UserValidator } from "../utils/user.validator.js";
import { RolesModel } from "../models/roles.model.js";

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
            const userHasAccess = await UserAccessModel.getUserByField('username', req.body.username);

            if(userHasAccess)
                throwError(`El usuario ${userHasAccess.username} ya esta registrado y su estado es ${userHasAccess.estado}`, 409);

            const roleIsValid = RolesModel.getRoleByID(req.body.roleID);

            if(!roleIsValid)
                throwError(`El rol no ha sido encontrado`, 404);

            const docNumberIsValid = await UserAccessModel.getUserByField('docNumber', req.body.documentNumber);

            if(docNumberIsValid)
                throwError(`El numero de documento esta en uso`, 409);

            const emailIsValid = await UserAccessModel.getUserByField('email', req.body.emal);

            if(emailIsValid)
                throwError(`El email esta en uso`, 409);

            UserValidator.validateUserInfo(req.body);

            await UserAccessModel.giveAccess(req.body)

            return res.status(201).json({
                message: `Al usuario ${req.body.username} se le ha dado acceso de manera correcta`
            });

        } catch (err) {
            next(err);
        }
    }

    static async updateAccess(req, res, next){
        try {
            const user = await UserAccessModel.getUserByField('userID', req.params.userID);
            
            if(!user) 
                throwError('El usuario no ha sido encontrado', 404);

            if(user.username !== req.body.username){
               const user = await UserAccessModel.getUserByField('username', req.body.username);

                if(user)  throwError(`El usuario ${user.username} ya esta registrado y su estado es ${user.estado}`, 409);
            }

            if(user.email !== req.body.email){
                const emailIsValid = await UserAccessModel.getUserByField('email', req.body.emal);

                if(emailIsValid) throwError(`El email esta en uso`, 409);
            }

            if(user.numero_documento != req.body.documentNumber){
                const docNumberIsValid = await UserAccessModel.getUserByField('docNumber', req.body.documentNumber);

                if(docNumberIsValid) throwError(`El numero de documento esta en uso`, 409);
            }

            const userInfo = {
                userID: req.params.userID,
                username: req.body.username || user.username,
                documentNumber: req.body.documentNumber || user.numero_documento, 
                email: req.body.email || user.email, 
                state: req.body.state || user.estado,
                roleID: req.body.roleID || user.rol_id
            }

            UserValidator.validateUserInfo(userInfo);

            await UserAccessModel.updateAcces(userInfo)

            return res.status(200).json({
                message: "Usuario actualizado correctamente"
            });

        } catch (err) {
            next(err);
        }
    }
}