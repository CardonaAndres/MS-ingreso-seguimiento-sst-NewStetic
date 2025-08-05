import express from 'express';
import upload from '../../../app/configs/multer.config.js';
import { ExamRecordsController } from '../controllers/examRecords.controller.js';

const router = express.Router();

router.get('/:checkListItemID/', ExamRecordsController.getExamRecords);
router.post('/', upload.single('document'), ExamRecordsController.create);

export default router;