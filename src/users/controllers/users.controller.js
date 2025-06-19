import { UserModel } from '../models/user.model.js';

export class UserController {
    static async getUserByProperties(req, res, next){
        try {
            const { property } = req.params;
            const users = await UserModel.getUserByProperties(property);

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
            console.log(err)
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
}