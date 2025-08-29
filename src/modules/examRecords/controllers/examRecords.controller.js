import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { validateDates } from '../utils/validateDates.js';
import { ExamLogsModel } from '../models/examLogs.model.js';
import { UserModel } from '../../users/models/user.model.js';
import { throwError } from '../../../app/utils/throw.error.js';
import { CheckListStates } from '../../../app/configs/config.js';
import { ExamRecordsModel } from '../models/examRecords.model.js';
import { ExamTypesModel } from '../../medicalFollowUp/models/examTypes.model.js';
import { ExamCheckListModel } from '../../medicalFollowUp/models/examChekList.model.js';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

export class ExamRecordsController {
    static async getExamRecords(req, res, next){
        try {
            const { page = 1, limit = 15 } = req.query;
            const examCheckListItem = await ExamCheckListModel.getCheckListItemByID(req.params.checkListItemID);

            if(!examCheckListItem) throwError('Examen no registrado para el colaborador.', 404);

            const { examRecords, totalExamRecords } = await ExamRecordsModel.getExamRecords(
                req.params.checkListItemID, page, limit
            );

            return res.status(200).json({
                message: 'Tarea exitosa',
                examCheckListItem: {
                    ...examCheckListItem,
                    records: examRecords
                },
                meta: {
                    totalExamRecords,
                    page: parseInt(page),
                    totalPages : Math.ceil(totalExamRecords / limit)
                }
            });

        } catch (err) {
            next(err)
        }
    }

    static async getIncomeOrEgressExamsRecords(req, res, next){
        try {

            const exams = await ExamRecordsModel.getIncomeOrEgressExamRecords(
                req.params.cc, 
                ` AND tpem.nombre = '${(req.query?.typeExam || 'income') === 'income' ? 'Ingreso' : 'Egreso'}'`
            );

            return res.status(200).json({
                message: 'Tarea exitosa',
                exams
            });
            
        } catch (err) {
            next(err);
        }
    }

    static async create(req, res, next){
        try {
            const { 
                checkListItemID, 
                state = 'Pendiente', 
                dateMade =  new Date(),
                expirationDate,
                frequencyInDays,
                observations = 'Sin observaciones'
            } = req.body;

            req.file 
             ? req.body.PDF_url = `${String(process.env.SERVER_URL)}/uploads/${req.file.filename}` 
             : req.body.PDF_url = 'SIN PDF';

            if (!checkListItemID) throwError('El item del CheckList hace falta', 400);

            const checkListItem = await ExamCheckListModel.getCheckListItemByID(checkListItemID);

            if(!checkListItem) throwError('El item del CheckList NO ha sido encontrado', 404);
            
            if(!CheckListStates.includes(state)) throwError('Estado NO valido', 404);
            
            validateDates(dateMade, expirationDate);

            if(!frequencyInDays || parseInt(frequencyInDays) < 1) throwError('Frecuencia en dias incorrecta', 400);
            
            const result = await ExamRecordsModel.create({
                checkListItemID, 
                state, 
                dateMade,
                expirationDate,
                observations,
                PDF_url: req.body.PDF_url,
                totalDays: frequencyInDays
            });

            if(!result.success)
                throwError('Hubo un error al registrar el examen, por favor volver a intentarlo', 400);
            
            await ExamLogsModel.create({
                checkListItemID: result.id,
                action: 'CREACIÓN',
                observations: `Observaciones: ${observations||'Sin observaciones'} | el estado hasta el momento era: '${state}'`,
                responsibleUser: req.user.displayName
            });

            return res.status(201).json({
                message: 'Examen ingresado correctamente'
            });

        } catch (err) {    
            if (req.file) {
                try {
                    await fs.unlink(req.file.path);
                } catch (unlinkError) {
                    console.error('Error al eliminar archivo:', unlinkError);
                }
            }

            next(err);
        }
    }

    static async createIncomeOrEgress(req, res, next){
        try {
            const { 
                userDocument,
                state = 'Pendiente', 
                dateMade =  new Date(),
                observations = 'Sin observaciones'
            } = req.body;

            let checklListID = undefined;

            if(!userDocument || userDocument.trim().length < 5) throwError('El documento del colaborador es obligatorio', 400);

            const user = await UserModel.getUsersByProperties(userDocument);
            
            if(!user[0]) throwError('colaborador NO encontrado', 400);

            if(req.query.typeExam && !['income', 'egress'].includes(req.query.typeExam))
                throwError('Tipo de examen inválido', 400);
            
            const examInfo = await ExamTypesModel.getExamByName(
                (req.query?.typeExam || 'income') === 'income' ? 'Ingreso' : 'Egreso'
            );

            if(!CheckListStates.includes(state)) throwError('Estado NO valido', 404);

            const userHasExamRegistered = await ExamCheckListModel.hasUserExamInChecklist(
                examInfo.tipo_examen_id, userDocument
            );
            
            if(!userHasExamRegistered){
                const result = await ExamCheckListModel.addCheckListItem(
                    userDocument, examInfo.tipo_examen_id, 'SI'
                );

                if(!result)
                    throwError('Hubo un error asignar el examen, por favor volver a intentarlo', 400);
                
                const newExamRecord = await ExamCheckListModel.hasUserExamInChecklist(
                    examInfo.tipo_examen_id, userDocument
                );

                checklListID = newExamRecord.checklist_id;

            } else {
                checklListID = userHasExamRegistered.checklist_id;
            }

            req.file 
             ? req.body.PDF_url = `${String(process.env.SERVER_URL)}/uploads/${req.file.filename}` 
             : req.body.PDF_url = 'SIN PDF';

            const result = await ExamRecordsModel.create({
                checkListItemID: checklListID, 
                state, 
                dateMade,
                expirationDate: new Date(),
                observations,
                PDF_url: req.body.PDF_url,
                totalDays: 1
            });

            if(!result.success)
                throwError('Hubo un error al registrar el examen, por favor volver a intentarlo', 400);
            
            await ExamLogsModel.create({
                checkListItemID: result.id,
                action: 'CREACIÓN',
                observations: `Observaciones: ${observations||'Sin observaciones'} | el estado hasta el momento era: '${state}'`,
                responsibleUser: req.user.displayName
            });

            return res.status(201).json({
                message: 'Tarea exitosa' 
            });

        } catch (err) {
            if (req.file) {
                try {
                    await fs.unlink(req.file.path);
                } catch (unlinkError) {
                    console.error('Error al eliminar archivo:', unlinkError);
                }
            }

            next(err);
        }
    }

    static async update(req, res, next){
        try {
            const examItem = await ExamRecordsModel.getExamRecordByID(req.params.checkListItemID);

            if(!examItem) throwError('El registro no ha sido encontrado', 404);

            const { 
                dateMade = examItem.fecha_realizado,
                expirationDate = examItem.fecha_vencimiento,
                observations = examItem.observaciones || "Sin observaciones",
                updateReason,
                state = examItem.estado,
                frequencyInDays = examItem.frecuencia_dias,
            } = req.body;

            if(!CheckListStates.includes(state)) throwError('Estado NO válido', 400);
            
            validateDates(dateMade, expirationDate);

            if(!frequencyInDays || parseInt(frequencyInDays) < 1) throwError('Frecuencia en días incorrecta', 400);
            

            if(!updateReason || updateReason.trim().length < 5) throwError('La razón de actualización es obligatoria', 400);
            
            if(req.file){
                req.body.PDF_url = `${String(process.env.SERVER_URL)}/uploads/${req.file.filename}`;

                const oldURLPath = (examItem.PDF_url && examItem.PDF_url !== 'SIN PDF')
                 ? path.join(__dirname, '..', '..', '..', 'uploads', examItem.PDF_url.split('/').pop()) 
                 : null;

                if (oldURLPath) {
                    try {
                        await fs.access(oldURLPath); 
                        await fs.unlink(oldURLPath); 
                    } catch (err) {
                        console.error("No se pudo eliminar la imagen anterior:", err.message);
                    }
                }

            } else {
                (examItem.PDF_url && examItem.PDF_url !== 'SIN PDF') 
                ? req.body.PDF_url = examItem.PDF_url 
                : req.body.PDF_url = 'SIN PDF';
            }

            const result = await ExamRecordsModel.update({
                checkListItemID: req.params.checkListItemID, 
                dateMade,
                expirationDate,
                state, 
                observations,
                PDF_url: req.body.PDF_url,
                totalDays: frequencyInDays
            });

            if(!result) throwError('No se pudo actualizar, volver a intentar por favor', 400);
         
            await ExamLogsModel.create({
                checkListItemID: req.params.checkListItemID,
                action: 'ACTUALIZACIÓN',
                observations:`Observaciones: ${observations||'Sin observaciones'} | Motivo de actualización dado: ${updateReason}`,
                responsibleUser: req.user.displayName
            });
       
            return res.status(200).json({
                message: 'Actualizado correctamente'
            });

        } catch (err) {
            if (req.file) {
                try {
                    await fs.unlink(req.file.path);
                } catch (unlinkError) {
                    console.error('Error al eliminar archivo:', unlinkError);
                }
            }
            
            next(err);
        }
    }

    static async delete(req, res, next){
        try {
            const examItem = await ExamRecordsModel.getExamRecordByID(req.params.checkListItemID);

            if(!examItem) throwError('El registro no ha sido encontrado', 404);

            if(!req.body.deletionReason || req.body.deletionReason.trim().length < 5)
                throwError('Por favor, dar el motivo de eliminación', 400);
    
            const result = await ExamRecordsModel.delete(req.params.checkListItemID);

            if(!result) throwError('No se pudo eliminar, volver a intentar por favor', 400);

            await ExamLogsModel.create({
                checkListItemID: req.params.checkListItemID,
                action: 'ELIMINACIÓN',
                observations: `Motivo de eliminación: ${req.body.deletionReason}`,
                responsibleUser: req.user.displayName
            });

            return res.status(200).json({
                message: 'Eliminado correctamente'
            });

        } catch (err) {
            next(err);
        }
    }
}