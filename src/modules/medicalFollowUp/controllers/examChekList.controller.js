import { UserModel } from '../../users/models/user.model.js';
import { ExamTypesModel } from '../models/examTypes.model.js';
import { throwError } from '../../../app/utils/throw.error.js';
import { ExamCheckListModel } from "../models/examChekList.model.js";

export class ExamCheckListController {
    static async getCheckList(req, res, next){
        try {
            const userActive = await UserModel.getUsersByProperties(req.params.userDocument)
            const userInActive = await UserModel.getUsersIdlesByProperties(req.params.userDocument);

            if(!userActive[0] && !userInActive[0]) throwError('colaborador NO encontrado', 400);

            const examsCheckList = await ExamCheckListModel.getCheckList(req.params.userDocument);
            const checkListFilter = examsCheckList.filter(
                e => String(e?.nombre).toLowerCase() !== 'ingreso' && String(e?.nombre).toLowerCase() !== 'egreso'
            );

            return res.status(200).json({
                message : 'Lista de tipos de examenes del colaborador',
                examsCheckList : checkListFilter,
                user: userActive ? userActive : userInActive
            });

        } catch (err) {
            next(err);
        }
    }
    
    static async addCheckListItem(req, res, next){
        try {
            const { userDocument, examTypeId, isRequired } = req.body;

            if(!userDocument || !examTypeId || !isRequired) throwError('Faltan campos obligatorios', 400);

            if(!['SI', 'NO'].includes(isRequired)) throwError('El campo "es requerido" no es valido', 400);

            const user = await UserModel.getUsersByProperties(userDocument);

            if(!user[0]) throwError('colaborador NO encontrado', 404);
        
            const examType = await ExamTypesModel.getExamByID(examTypeId);

            if(!examType) throwError('tipo de examen NO encontrado', 404);

            const hasUserExam = await ExamCheckListModel.hasUserExamInChecklist(examTypeId, userDocument);

            if(hasUserExam) throwError('El colaborador ya tiene este examen asignado', 400);

            const result = await ExamCheckListModel.addCheckListItem(userDocument, examTypeId, isRequired);

            if(!result) throwError('Hubo un error asignar el examen, por favor volver a intentarlo', 400);

            return res.status(201).json({
                message: 'Examen asignado correctamente al colaborador.'
            });

        } catch (err) {
            next(err);
        }
    }

    static async updateCheckListItem(req, res, next){
        try {
            const checkListItem = await ExamCheckListModel.getCheckListItemByID(req.params.checkListItemID);

            if(!checkListItem) throwError('El examen asociado NO ha sido encontrado', 404);

            const { 
                examTypeId = checkListItem.tipo_examen_id,
                isRequired = checkListItem.es_requerido, 
                state = checkListItem.estado
            } = req.body;

            const examType = await ExamTypesModel.getExamByID(examTypeId);

            if(!examType) throwError('El tipo examen NO ha sido encontrado', 404);

            if(examTypeId !== checkListItem.tipo_examen_id){
                const hasUserExam = await ExamCheckListModel.hasUserExamInChecklist(examTypeId, userDocument);
                if(hasUserExam) throwError('El colaborador ya tiene este examen asignado', 409);
            }

            if(!['SI', 'NO'].includes(isRequired)) throwError('El campo "es requerido" no es valido', 400);

            if(!['Activo', 'Inactivo'].includes(state)) throwError('El campo "estado" no es valido', 400);

            const result = await ExamCheckListModel.updateCheckListItem(
                examTypeId, isRequired, state, req.params.checkListItemID
            );

            if(!result) 
                throwError('Hubo un error actualizar, por favor volver a intentarlo', 400);

            return res.status(200).json({
                message : 'Examen asociado actualizado correctamente'
            });

        } catch (err) {
            next(err);
        }
    }
}