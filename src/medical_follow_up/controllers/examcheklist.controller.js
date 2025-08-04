import { UserModel } from '../../users/models/user.model.js';
import { ExamTypesModel } from '../models/examtypes.model.js';
import { ExamCheckListModel } from "../models/examcheklist.model.js";

export class ExamCheckListController {
    static async getCheckList(req, res, next){
        try {
            const user = await UserModel.getUsersByProperties(req.params.userDocument)

            if(!user[0]){
                const err = new Error('colaborador NO encontrado');
                err.status = 400;
                throw err;  
            }

            const examsCheckList = await ExamCheckListModel.getCheckList(req.params.userDocument);
            const checkListFilter = examsCheckList.filter(
                e => String(e?.nombre).toLowerCase() !== 'ingreso' && String(e?.nombre).toLowerCase() !== 'egreso'
            );

            return res.status(200).json({
                message : 'Lista de tipos de examenes del colaborador',
                examsCheckList : checkListFilter
            });

        } catch (err) {
            next(err);
        }
    }
    
    static async addCheckListItem(req, res, next){
        try {
            const { userDocument, examTypeId, isRequired } = req.body;

            if(!userDocument || !examTypeId || !isRequired){
                const err = new Error('Faltan campos obligatorios');
                err.status = 400;
                throw err;
            }

            if(!['SI', 'NO'].includes(isRequired)){
                const err = new Error('El campo "es requerido" no es valido');
                err.status = 400;
                throw err;
            }

            const user = await UserModel.getUsersByProperties(userDocument);

            if(!user[0]){
                const err = new Error('colaborador NO encontrado');
                err.status = 400;
                throw err;  
            }

            const examType = await ExamTypesModel.getExamByID(examTypeId);

            if(!examType){
                const err = new Error('tipo de examen NO encontrado');
                err.status = 400;
                throw err;  
            }

            const hasUserExam = await ExamCheckListModel.hasUserExamInChecklist(examTypeId, userDocument);

            if(hasUserExam){
                const err = new Error('El colaborador ya tiene este examen asignado');
                err.status = 400;
                throw err;  
            }
            
            const result = await ExamCheckListModel.addCheckListItem(userDocument, examTypeId, isRequired);

            if(!result){
                const err = new Error('Hubo un error asignar el examen, por favor volver a intentarlo');
                err.status = 400;
                throw err;  
            }

            return res.status(201).json({
                message: 'Examen asignado correctamente al colaborador.'
            });

        } catch (err) {
            next(err);
        }
    }

    static async updateCheckListItem(req, res, next){
        try {
            const checkListItem = await ExamCheckListModel.getCheckListItemByID(req.params.CheckListItemByID);

            if(!checkListItem){
                const err = new Error('El examen asociado NO ha sido encontrado');
                err.status = 404;
                throw err;
            }

            const { 
                examTypeId = checkListItem.tipo_examen_id,
                isRequired = checkListItem.es_requerido, 
                state = checkListItem.estado
            } = req.body;

            const examType = await ExamTypesModel.getExamByID(examTypeId);

            if(!examType){
                const err = new Error('El tipo examen NO ha sido encontrado');
                err.status = 404;
                throw err;
            }

            if(examTypeId !== checkListItem.tipo_examen_id){
                const hasUserExam = await ExamCheckListModel.hasUserExamInChecklist(examTypeId, userDocument);

                if(hasUserExam){
                    const err = new Error('El colaborador ya tiene este examen asignado');
                    err.status = 409;
                    throw err;  
                }
            }

            if(!['SI', 'NO'].includes(isRequired)){
                const err = new Error('El campo "es requerido" no es valido');
                err.status = 400;
                throw err;
            }

            if(!['Activo', 'Inactivo'].includes(state)){
                const err = new Error('El campo "estado" no es valido');
                err.status = 400;
                throw err;
            }

            return res.status(200).json({
                message : 'Examen asociado actualizado correctamente'
            });

        } catch (err) {
            next(err);
        }
    }
}