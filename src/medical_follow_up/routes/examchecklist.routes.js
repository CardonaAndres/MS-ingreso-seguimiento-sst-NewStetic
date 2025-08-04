import express from "express";
import { ExamCheckListController } from "../controllers/examcheklist.controller.js";

const router = express.Router();

router.get('/:userDocument', ExamCheckListController.getCheckList);
router.post('/', ExamCheckListController.addCheckListItem);
router.patch('/:CheckListItemByID', ExamCheckListController.updateCheckListItem);

export default router;