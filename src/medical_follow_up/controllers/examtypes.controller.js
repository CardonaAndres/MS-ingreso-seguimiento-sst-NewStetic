import { ExamTypesModel } from "../models/examtypes.model.js";

export class ExamTypesController {
    static async getExamTypes(_, res, next) {
        try {
            const examTypes = await ExamTypesModel.examTypes();

            return res.status(200).json({
                message : 'Todos los tipos de examenes registrados',
                examTypes
            })
        } catch (err) {
            next(err);
        }
    }

    static async createExamType(req, res, next) {   
        try {
            const { name } = req.body;

            if (!name) {
                const err = new Error('El nombre del tipo de examen es requerido');
                err.status = 400;
                throw err;
            }

            if(name.length < 3) {
                const err = new Error('El nombre del tipo de examen debe tener al menos 3 caracteres');
                err.status = 400;
                throw err;
            }

            const examType = await ExamTypesModel.createExamType(name);

            if(examType.rowsAffected < 1){
                const err = new Error('No se pudo crear el tipo de examen');
                err.status = 500;
                throw err;
            }

            return res.status(201).json({
                message: 'Tipo de examen creado correctamente'
            });

        } catch (err) {
            next(err);
        }
    }

    static async updateExamType(req, res, next){
        try {
            const examType = await ExamTypesModel.getExamByID(req.params.examTypeId);

            if(!examType){
                const err = new Error('El tipo de examen no ha sido encontrado');
                err.status = 404;
                throw err;
            }

            const { name = examType.nombre, state = examType.estado } = req.body;

            if (!name || !state) {
                const err = new Error('El nombre y el estado del tipo de examen son requeridos');
                err.status = 400;
                throw err;
            }

            if(name.length < 3) {
                const err = new Error('El nombre del tipo de examen debe tener al menos 3 caracteres');
                err.status = 400;
                throw err;
            }

            if(!['Activo', 'Inactivo'].includes(state)) {
                const err = new Error('El estado del tipo de examen debe ser "Activo" o "Inactivo"');
                err.status = 400;
                throw err;
            }

            const examTypeToUpdate = await ExamTypesModel.updateExamType(
                req.params.examTypeId, 
                name, 
                state
            );

            if(examTypeToUpdate.rowsAffected < 1){
                const err = new Error('No se pudo actualizar el tipo de examen');
                err.status = 500;
                throw err;
            }

            return res.status(200).json({
                message: 'Tipo de examen actualizado correctamente'
            });

        } catch (err) {
            next(err);
        }
    }
}