import sql from 'mssql';
import { ConnDataBase } from '../../app/utils/conn.database.js';

const conn = new ConnDataBase().connect(String(process.env.DB_SST_NAME));

export class AreasModel {
    static async getAreas(){
        const areas = await conn.request().query(`SELECT * FROM areas`);
        return areas.recordset;
    }

    static async getAreaByID(areaID){
        const areas = await conn.request()
        .input('area_id', sql.Int, areaID)
        .query(`SELECT * FROM areas WHERE area_id = @area_id`);
        return areas.recordset[0];
    }

    static async getAreasPaginate(page, limit){
        const areas = await conn.request()
        .input('page', sql.Int, page).input('limit', sql.Int, limit)
        .query(`SELECT * FROM areas ORDER BY nombre OFFSET (@page - 1) * @limit ROWS FETCH NEXT @limit ROWS ONLY`);

        const totalAreas = await conn.request().query(`SELECT COUNT(*) AS totalAreas FROM areas`);
        
        return {
            areas: areas.recordset,
            totalAreas: totalAreas.recordset[0].totalAreas
        }
    }

    static async create(name){
        const result = await conn.request()
         .input('name', sql.VarChar, name)
         .query(`INSERT INTO areas (nombre, estado) VALUES (@name, 'Activa')`);

        return result.rowsAffected[0] == 1
    }

    static async update(areaID, name, state){
        const result = await conn.request()
        .input('name', sql.VarChar, name)
        .input('state', sql.VarChar, state)
        .input('areaID', sql.Int, areaID)
        .query(`UPDATE areas SET nombre = @name, estado = @state WHERE area_id = @areaID`);

        return result.rowsAffected[0] == 1;
    }
}