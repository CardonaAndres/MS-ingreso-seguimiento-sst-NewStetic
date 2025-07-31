import { AreasModel } from "../models/areas.model.js";

export class AreasController {
    static async getAreasPaginate(req, res, next){
        try {
            const {page = 1 , limit = 15} = req.query;
            const { areas, totalAreas } = await AreasModel.getAreasPaginate(
                parseInt(page), parseInt(limit)
            )

            return res.status(200).json({
                message: 'Tarea realizada correctamente',
                areas,
                meta: {
                    page: parseInt(page),
                    totalAreas,
                    totalPages : Math.ceil(totalAreas / limit),
                    limit: parseInt(limit)
                }
            })

        } catch (err) {
            next(err);
        }
    }

    static async getAreas(_, res, next){
        try {
            const areas = await AreasModel.getAreas();

            return res.status(200).json({
                message: 'Tarea realizada correctamente',
                areas
            });
        } catch (err) {
            next(err);
        }
    }

    static async create(req, res, next){
        try {
            const { name } = req.body;

            if (!name) {
                const err = new Error('El nombre del area es requerida');
                err.status = 400;
                throw err;
            }

            if (name.length < 4) {
                const err = new Error('Ponle un nombre minimo de 4 caracteres');
                err.status = 400;
                throw err;
            }

            const result = await AreasModel.create(name);

            if(!result){
                const err = new Error('Hubo un error, no se pudo crear el area');
                err.status = 500;
                throw err;
            }

            return res.status(201).json({
                message: 'El area ' + name + ' fue registrada correctamente'
            })

        } catch (err) {
            next(err);
        }
    }

    static async update(req, res, next){
        try {
            const area = await AreasModel.getAreaByID(req.params.areaID);
            
            if(!area){
                const err = new Error('El area no ha sido encontrada');
                err.status = 404;
                throw err
            }

            const { name = area.nombre, state = area.estado } = req.body;

            if(!['Activa', 'Inactiva'].includes(state)){
                const err = new Error('Estado NO valido, solo puede ser Activa o Inactiva');
                err.status = 400;
                throw err
            }

            if (name.length < 4) {
                const err = new Error('Ponle un nombre minimo de 4 caracteres');
                err.status = 400;
                throw err;
            }

            const result = await AreasModel.update(
                req.params.areaID, name, state
            );

            if(!result){
                const err = new Error('Hubo un error, no se pudo actualizar el area');
                err.status = 500;
                throw err;
            }

            return res.status(200).json({
                messge : 'El area fue actualizada correctamente'
            });

        } catch (err) {
            next(err);
        }
    }
}