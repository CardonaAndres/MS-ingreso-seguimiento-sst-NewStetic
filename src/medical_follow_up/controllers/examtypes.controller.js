import { ExamTypesModel } from "../models/examtypes.model.js";

export class ExamTypesController {
    static async getExamTypes(req, res, next) {
        try {
            const examTypes = await ExamTypesModel.ExamTypes();

            return res.status(200).json({
                message : 'Todos los tipos de examenes registrados',
                examTypes
            })
        } catch (err) {
            next(err);
        }
    }
}