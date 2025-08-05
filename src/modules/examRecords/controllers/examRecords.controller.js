import fs from 'fs/promises';
import { validateDates } from '../utils/validateDates.js';
import { CheckListStates } from '../../../app/configs/config.js';
import { ExamRecordsModel } from '../models/examRecords.model.js';
import { ExamCheckListModel } from '../../medicalFollowUp/models/examChekList.model.js';

export class ExamRecordsController {
    static async getExamRecords(req, res, next){
        try {
            const { page = 1, limit = 15 } = req.query;
            const examCheckListItem = await ExamCheckListModel.getCheckListItemByID(req.params.checkListItemID);

            if(!examCheckListItem){
                const err = new Error('Examen no registrado para el colaborador.');
                err.status = 404;
                throw err;
            }

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

            if (!checkListItemID) {
               const err = new Error('El item del CheckList hace falta');
               err.status = 400;
               throw err;
            }

            const checkListItem = await ExamCheckListModel.getCheckListItemByID(checkListItemID);

            if(!checkListItem){
                const err = new Error('El item del CheckList NO ha sido encontrado');
                err.status = 404;
                throw err;
            }

            if(!CheckListStates.includes(state)){
                const err = new Error('Estado NO valido');
                err.status = 404;
                throw err;
            }

            validateDates(dateMade, expirationDate);

            if(!frequencyInDays || parseInt(frequencyInDays) < 1){
                const err = new Error('Frecuencia en dias incorrecta');
                err.status = 400;
                throw err;
            }

            const result = await ExamRecordsModel.create({
                checkListItemID, 
                state, 
                dateMade,
                expirationDate,
                observations,
                PDF_url: req.body.PDF_url,
                totalDays: frequencyInDays
            });

            if(!result){
                const err = new Error('Hubo un error al registrar el examen, por favor volver a intentarlo');
                err.status = 400;
                throw err;
            }

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
}