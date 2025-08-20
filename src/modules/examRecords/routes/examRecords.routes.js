import express from 'express';
import upload from '../../../app/configs/multer.config.js';
import { ExamRecordsController } from '../controllers/examRecords.controller.js';

const router = express.Router();

router.get('/:checkListItemID/', ExamRecordsController.getExamRecords);
router.get('/inc-eg/:cc/', ExamRecordsController.getIncomeOrEgressExamsRecords);
router.post('/', upload.single('document'), ExamRecordsController.create);
router.post('/inc-eg', upload.single('document'), ExamRecordsController.createIncomeOrEgress);
router.patch('/:checkListItemID', upload.single('document'), ExamRecordsController.update);
router.delete('/:checkListItemID', ExamRecordsController.delete);

export default router;
