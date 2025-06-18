import sql from 'mssql';
import { conn_db } from "../../utils/conn.database.js";
import * as queries from '../utils/queries.js';

const conn = await conn_db();

export class UserModel {
    static async getUserByProperties(property){
        const users = await conn.request()
        .input('property', sql.NVarChar, `%${property}%`)
        .query(queries.userByProperties)

        return users.recordset
    }

    static async getAllUsersPaginate(page = 1, limit = 30){
    
        const totalUsersQuery = await conn.request().query(queries.totalUsers);
        const usersQuery = await conn.request().query(queries.users(page, limit));

        return {
            total_users : totalUsersQuery.recordset[0].TotalUsuarios,
            users : usersQuery.recordset
        }

    }
}