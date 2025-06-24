import sql from 'mssql';
import { conn_db } from "../../utils/conn.database.js";
import * as queries from '../utils/queries.js';

const conn = await conn_db();

export class UserModel {
    static async getUsersByProperties(property){
        const users = await conn.request()
        .input('property', sql.NVarChar, `%${property}%`)
        .query(queries.usersByProperties)

        return users.recordset
    }

    static async getAllUsersPaginate(page = 1, limit = 30){
    
        const totalUsersQuery = await conn.request().query(queries.totalUsers);
        const usersQuery = await conn.request()
        .input('page', sql.Int, parseInt(page))
        .input('limit', sql.Int, parseInt(limit))
        .query(queries.users);

        return {
            total_users : totalUsersQuery.recordset[0].TotalUsuarios,
            users : usersQuery.recordset
        }

    }

    static async getUsersIdlesByProperties(property){
        const users = await conn.request()
        .input('property', sql.NVarChar, `%${property}%`)
        .query(queries.usersIdlesByProperties)

        return users.recordset
    }

    static async getAllUsersIdlesPaginate(page = 1, limit = 30){
        const totalUsersIdleQuery = await conn.request().query(queries.totalUsersIdles);
        const usersIdleQuery = await conn.request()
        .input('page', sql.Int, parseInt(page))
        .input('limit', sql.Int, parseInt(limit)).query(queries.usersIdles)

        return {
            total_users_inactivos : totalUsersIdleQuery.recordset[0].TotalUsuariosInactivos,
            users_idle : usersIdleQuery.recordset
        }
    }

    static async getUserWorkHistory(docNumber){
        const userWorkHistory = await conn.request()
        .input('docNumber', sql.NVarChar, String(docNumber))
        .query(queries.userWorkHistory);

        return {
            userWorkHistory : userWorkHistory.recordset
        }
    }

}