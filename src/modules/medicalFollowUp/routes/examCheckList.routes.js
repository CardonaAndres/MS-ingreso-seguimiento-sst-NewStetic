import express from "express";
import { medicalFollowUpPermissions } from "../utils/permissions.js";
import { authorize } from "../../accessManager/middlewares/authorize.js";
import { ExamCheckListController } from "../controllers/examChekList.controller.js";

const permissions = {
    create: medicalFollowUpPermissions["examChecklist.create"].code,
    update: medicalFollowUpPermissions["examChecklist.update"].code
}

const router = express.Router();

router.get('/:userDocument', ExamCheckListController.getCheckList);
router.post('/', authorize(permissions.create), ExamCheckListController.addCheckListItem);
router.patch('/:checkListItemID', authorize(permissions.update), ExamCheckListController.updateCheckListItem);

export default router;