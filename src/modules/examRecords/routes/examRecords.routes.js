import express from 'express';
import upload from '../../../app/configs/multer.config.js';
import { authorize } from "../../accessManager/middlewares/authorize.js";
import { examRecordsPermissions } from "../utils/permissions.js";
import { ExamRecordsController } from '../controllers/examRecords.controller.js';

const permissions = {
    create: examRecordsPermissions["examRecords.create"].code,
    update: examRecordsPermissions["examRecords.update"].code,
    createIncEg: examRecordsPermissions["examRecords.createIncomeOrEgress"].code,
    delete: examRecordsPermissions["examRecords.delete"].code
}

const router = express.Router();

router.get('/:checkListItemID/', ExamRecordsController.getExamRecords);
router.get('/inc-eg/:cc/', ExamRecordsController.getIncomeOrEgressExamsRecords);
router.post('/', authorize(permissions.create), upload.single('document'), ExamRecordsController.create);

router.post(
    '/inc-eg', authorize(permissions.createIncEg), 
    upload.single('document'), ExamRecordsController.createIncomeOrEgress
);

router.patch(
    '/:checkListItemID', authorize(permissions.update), 
    upload.single('document'), ExamRecordsController.update
);

router.delete('/:checkListItemID', authorize(permissions.delete), ExamRecordsController.delete);

export default router;
