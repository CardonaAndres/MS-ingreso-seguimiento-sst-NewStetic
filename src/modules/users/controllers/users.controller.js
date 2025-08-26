import { UserModel } from '../models/user.model.js';

export class UserController {
    static async getUsersByProperties(req, res, next){
        try {
            const { property } = req.params;
            const users = await UserModel.getUsersByProperties(property);

            if(users.length < 1){
                const err = new Error('No hay resultados');
                err.status = 404;
                throw err
            }

            return res.status(200).json({
                message : 'Usuario encontrado correctamente',
                users
            });

        } catch (err) {
            next(err);
        }
    }

    static async getUsersPaginate(req, res, next){
        try {  
            const { page = 1, limit = 30 } = req.query;
            const usersInfo = await UserModel.getAllUsersPaginate(
                parseInt(page), parseInt(limit)
            );

            return res.status(200).json({
                message : 'Tarea exitosa',
                users : usersInfo.users,
                meta : {
                    totalUsers : usersInfo.total_users,
                    page,
                    total_pages : Math.ceil(usersInfo.total_users / limit)
                }
            })

        } catch (err) {
            next(err);
        }
    }

    static async getUsersIdlesByProperties(req, res, next){
        try {
            const { property } = req.params;
            const users = await UserModel.getUsersIdlesByProperties(property);

            if(users.length < 1){
                const err = new Error('No hay resultados');
                err.status = 404;
                throw err
            }

            return res.status(200).json({
                message : 'Usuario encontrado correctamente',
                users
            });

        } catch (err) {
            next(err);
        }
    }

    static async getUsersIdlesPaginate(req, res, next){
        try {
            const { page = 1, limit = 30 } = req.query;

            const usersIdlesInfo = await UserModel.getAllUsersIdlesPaginate(page, limit);
            
            return res.status(200).json({
                message : 'Lista de personal inactivo.',
                users : usersIdlesInfo.users_idle,
                meta : {
                    totalUsers : usersIdlesInfo.total_users_inactivos,
                    page,
                    total_pages : Math.ceil(usersIdlesInfo.total_users_inactivos / limit)
                }
            });

        } catch (err) {
            next(err);
        }
    }

    static async getWorkHistoryWork(req, res, next){
        try {
            const { docNumber } = req.params;
            const { userWorkHistory } = await UserModel.getUserWorkHistory(docNumber);
            
            if(userWorkHistory.length < 1){
                const err = new Error('El usuario con ese número de documento no existe');
                err.status = 404;
                throw err
            }

            return res.status(200).json({
                message : 'Trayectorial laboral del usuario',
                userWorkHistory
            })

        } catch (err) {
            next(err);
        }
    }

    static async getUsersToReport(req, res, next){
        try {
            let addToQuery = ` `;
            const { collaboratorsStatus, collaboratorType } = req.query;

            if(!collaboratorsStatus && !collaboratorType){
                const err = new Error('Debe enviar al menos un parámetro');
                err.status = 400;
                throw err;
            }

            if(collaboratorsStatus && String(collaboratorsStatus).toUpperCase() === 'INACTIVO')
                addToQuery += ` AND [w0550_contratos].c0550_ind_estado = 1 `;

            if(collaboratorsStatus && String(collaboratorsStatus).toUpperCase() === 'ACTIVO')
                addToQuery += ` AND [w0550_contratos].c0550_ind_estado != 1 `;

            if(collaboratorType && String(collaboratorType).toUpperCase() === 'NEW STETIC')
                addToQuery += ` AND (CASE WHEN c0540_id_cia = 1 THEN 'New Stetic' ELSE 'Temporal' END) LIKE '%New Stetic%'`;

            if(collaboratorType && String(collaboratorType).toUpperCase() === 'TEMPORAL')
                addToQuery += ` AND (CASE WHEN c0540_id_cia = 1 THEN 'New Stetic' ELSE 'Temporal' END) LIKE '%Temporal%'`;

            addToQuery += ` ORDER BY f200_nombres + ' ' + f200_apellido1 + ' ' + f200_apellido2`;

            const users = await UserModel.getUsersToReport(addToQuery);

            return res.status(200).json({
                message: 'Tarea exitosa',
                users
            })

        } catch (err) { 
            next(err);
        }
    }
}