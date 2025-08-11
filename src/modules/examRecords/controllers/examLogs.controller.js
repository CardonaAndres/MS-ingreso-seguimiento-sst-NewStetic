import { ExamLogsModel } from '../models/examLogs.model.js';

export class ExamLogsController {
    static async getLogs(req, res, next){
        try {
            const logs = await ExamLogsModel.getLogs(req.params.checkListItemID);

            return res.status(200).json({
                message: 'Tarea exitosa',
                logs
            });

        } catch (err) {
            next(err);
        }
    }
}