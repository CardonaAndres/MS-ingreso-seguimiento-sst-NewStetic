import express from "express";
import { medicalFollowUpPermissions } from "../utils/permissions.js";
import { authorize } from "../../accessManager/middlewares/authorize.js";
import { ExamTypesController } from "../controllers/examTypes.controller.js";

const permissions = {
    create: medicalFollowUpPermissions["examtypes.update"].code,
    update: medicalFollowUpPermissions["examtypes.update"].code
}

const router = express.Router();

router.get('/', ExamTypesController.getExamTypes);
router.post('/', authorize(permissions.create), ExamTypesController.createExamType);
router.patch('/:examTypeId', authorize(permissions.update), ExamTypesController.updateExamType);

export default router;