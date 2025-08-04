import express from "express";
import { ExamCheckListController } from "../controllers/examChekList.controller.js";

const router = express.Router();

router.get('/:userDocument', ExamCheckListController.getCheckList);
router.post('/', ExamCheckListController.addCheckListItem);
router.patch('/:checkListItemID', ExamCheckListController.updateCheckListItem);

export default router;