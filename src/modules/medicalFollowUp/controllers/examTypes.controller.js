import { ExamTypesModel } from "../models/examTypes.model.js";
import { throwError } from '../../../app/utils/throw.error.js';

export class ExamTypesController {
    static async getExamTypes(req, res, next) {
        try {
            let addToQuery;

            req.query.condition === 'actives' 
             ? addToQuery = "WHERE estado = 'Activo'"
             : addToQuery = ''

            const examTypes = await ExamTypesModel.examTypes(addToQuery);

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

            if (!name) throwError('El nombre del tipo de examen es requerido', 400);

            if(name.length < 3) throwError('El nombre del tipo de examen debe tener al menos 3 caracteres', 400);

            const examType = await ExamTypesModel.createExamType(name);

            if(examType.rowsAffected < 1) throwError('No se pudo crear el tipo de examen', 500);

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

            if(!examType) throwError('El tipo de examen no ha sido encontrado', 404);
            
            const { name = examType.nombre, state = examType.estado } = req.body;

            if (!name || !state) throwError('El nombre y el estado del tipo de examen son requeridos', 400);

            if(name.length < 3) throwError('El nombre del tipo de examen debe tener al menos 3 caracteres', 400);

            if(!['Activo', 'Inactivo'].includes(state)) throwError('El estado del tipo de examen debe ser "Activo" o "Inactivo"', 400);

            const examTypeToUpdate = await ExamTypesModel.updateExamType(
                req.params.examTypeId, 
                name, 
                state
            );

            if(examTypeToUpdate.rowsAffected < 1) throwError('No se pudo actualizar el tipo de examen');
            
            return res.status(200).json({
                message: 'Tipo de examen actualizado correctamente'
            });

        } catch (err) {
            next(err);
        }
    }
}