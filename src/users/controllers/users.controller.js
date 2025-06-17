import { UserModel } from '../models/user.model.js';

export class UserController {
    static async getUserByNumDoc(req, res, next){
        try {
            const { num_doc } = req.params;

            const user = await UserModel.getUserByNumDoc(num_doc);

            if(!user[0]) throw new Error('Usuario NO encontrado')

            return res.status(200).json({
                message : 'Usuario encontrado correctamente',
                user : user[0]
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
}