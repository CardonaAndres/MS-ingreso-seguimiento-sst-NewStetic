import fs from 'fs/promises';
import { ExamCheckListModel } from '../../medicalFollowUp/models/examChekList.model.js';
import { getDaysBetweenDates } from '../utils/getDaysBetweenDates.js';

export class ExamRecordsController {
    static async create(req, res, next){
        try {
            const { 
                checkListItemID, 
                state = 'Pendiente', 
                dateMade =  new Date(),
                expirationDate
            } = req.body;

            if (req.file) req.body.PDF_url = `${String(process.env.SERVER_URL)}/uploads/${req.file.filename}`;

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

            const daysBetweenDates = getDaysBetweenDates(dateMade, expirationDate);

            return res.status(201).json({
                message: 'Examen ingresado correctamente'
            })

        } catch (err) {    
            // Si hubo error y se subió archivo, eliminarlo
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