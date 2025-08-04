import fs from 'fs/promises';

export class ExamRecordsController {
    static async create(req, res, next){
        try {
            const { name, checkListItemID } = req.body;

            if (req.file) req.body.PDF_url = `${String(process.env.SERVER_URL)}/uploads/${req.file.filename}`;

            if (!checkListItemID) {
               const err = new Error('El item del CheckList hace falta');
               err.status = 400;
               throw err;
            }
            
            // Valores por defecto
            data.estado = data.estado || 'pendiente';
            data.fecha_realizado = data.fecha_realizado || new Date();

        } catch (err) {
            console.error('Error al crear item:', err);
            
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